import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { treeChartMockData } from "../charts-mock-data";
import * as d3 from "d3";

@Component({
  selector: "app-tree-chart",
  standalone: true,
  imports: [],
  templateUrl: "./tree-chart.component.html",
  styleUrl: "./tree-chart.component.scss",
})
export class TreeChartComponent {
  @Input() isPreview: boolean = false;

  private chartData = treeChartMockData;
  root: any;
  tree: any;
  treeLayout: any;
  svg: any;

  treeData: any;

  height: number;
  width: number;
  margin: any = { top: 200, bottom: 90, left: 100, right: 90 };
  duration: number = 750;
  nodeWidth: number = 5;
  nodeHeight: number = 5;
  nodeRadius: number = 5;
  horizontalSeparationBetweenNodes: number = 5;
  verticalSeparationBetweenNodes: number = 5;
  nodeTextDistanceY: string = "-5px";
  nodeTextDistanceX: number = 5;
  dx: number;
  dy: number;
  rectX: number;
  rectY: number;
  dragStarted: boolean;
  draggingNode: any;
  nodes: any[];
  selectedNodeByDrag: any;
  gLink: any;
  gNode: any;
  diagonal: any;

  selectedNodeByClick: any;
  previousClickedDomNode: any;
  links: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.margin = { top: 100, bottom: 100, left: 100, right: 100 };
    this.width = 928;
    this.renderTreeChart();
  }

  backToMain() {
    this.router.navigateByUrl("");
  }

  changeZoom(trent: string) {
    if (trent === "-") {
      this.width = this.width * 1.5;
    } else if (trent === "+") {
      this.width = this.width / 1.5;
    } else if (trent === "reset") {
      this.width = 300 * this.root.height;
    }
    this.update(null, this.root);
  }

  renderTreeChart() {
    this.root = d3.hierarchy(this.chartData, (d) => {
      return d.children;
    });

    // Card dimensions
    this.rectX = 240;
    this.rectY = 60;

    // Vertical spacing between nodes
    this.dx = 140;

    // Calculate width based on tree depth
    this.width = Math.max(window.innerWidth, 350 * this.root.height);

    // Horizontal spacing between levels
    this.dy = 400;

    this.tree = d3.tree().nodeSize([this.dx, this.dy]);

    this.diagonal = d3
      .linkHorizontal()
      .source((d) => {
        const dItem: any = d;
        return [dItem.source.y + this.rectX, dItem.source.x];
      })
      .target((d) => {
        const dItem: any = d;
        return [dItem.target.y, dItem.target.x];
      });

    // Remove previous SVG if exists
    d3.select("figure#tree svg").remove();

    this.svg = d3
      .select("figure#tree")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.dx)
      .attr("viewBox", [
        -this.margin.left,
        -this.margin.top,
        this.width,
        this.dx,
      ])
      .attr(
        "style",
        "min-width:100vw; max-width:none; height:auto; font:10px sans-serif; user-select:none;"
      );

    this.gLink = this.svg
      .append("g")
      .attr("fill", "none")
      .attr("stroke", "#CBD5E1")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2);

    this.gNode = this.svg
      .append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

    this.root.x0 = this.dy / 2;
    this.root.y0 = 0;

    // Assign colors to root level nodes first
    const colors = [
      "#9C27B0", // Purple
      "#43C6AC", // Teal
      "#FF9800", // Orange
      "#2196F3", // Blue
      "#E91E63", // Pink
      "#009688", // Cyan
      "#673AB7", // Deep Purple
      "#FF5722", // Deep Orange
    ];

    this.root.descendants().forEach((d: any, i: any) => {
      d.id = i;

      // Assign color to root-level children (direct children of root)
      if (d.depth === 1) {
        d.data.groupColor = colors[i % colors.length];
      }
      // All descendants inherit from their ancestors
      else if (d.depth > 1) {
        let parent = d.parent;
        while (parent && !parent.data.groupColor) {
          parent = parent.parent;
        }
        if (parent && parent.data.groupColor) {
          d.data.groupColor = parent.data.groupColor;
        }
      }
      // Root node gets a default color
      else if (d.depth === 0) {
        d.data.groupColor = "#999";
      }

      if (!this.isPreview) {
        d._children = d.children;
        if (d.depth && d.data.name.length !== 7) d.children = null;
      }
    });

    this.update(null, this.root);
  }

  update(event: any, source: any) {
    const duration = event?.altKey ? 2500 : 500;
    const nodes = this.root.descendants().reverse();
    const links = this.root.links();

    // Compute the new tree layout
    this.tree(this.root);

    let left = this.root;
    let right = this.root;
    this.root.eachBefore((node: any) => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });

    const height = right.x - left.x + this.margin.top + this.margin.bottom;

    const transition = this.svg
      .transition()
      .duration(duration)
      .attr("height", height)
      .attr("viewBox", [
        -this.margin.left,
        left.x - this.margin.top,
        this.width,
        height,
      ])
      .tween(
        "resize",
        window.ResizeObserver ? null : () => () => this.svg.dispatch("toggle")
      );

    // Update the nodes
    const node = this.gNode.selectAll("g").data(nodes, (d: any) => d.id);

    // Enter any new nodes at the parent's previous position
    const nodeEnter = node
      .enter()
      .append("g")
      .attr("transform", (d: any) => `translate(${source.y0},${source.x0})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)
      .on("click", (event: any, d: { children: any; _children: any }) => {
        d.children = d.children ? null : d._children;
        this.update(event, d);
      });

    // Helper function to get node color
    const getNodeColor = (d: any): string => {
      // Always use the assigned groupColor
      return d.data.groupColor || "#999";
    };

    // OUTER rect = main border
    nodeEnter
      .append("rect")
      .attr("class", "outer-rect")
      .attr("width", this.rectX)
      .attr("height", this.rectY)
      .attr("y", -this.rectY / 2 + 2)
      .attr("rx", 14)
      .attr("ry", 14)
      .attr("fill", "none")
      .attr("stroke-width", 3)
      .attr("stroke", (d: any) => getNodeColor(d));

    // INNER SHADED rect = padding area
    nodeEnter
      .append("rect")
      .attr("class", "inner-shade")
      .attr("width", this.rectX - 6) // slightly smaller than outer
      .attr("height", this.rectY - 6)
      .attr("x", 3)
      .attr("y", -this.rectY / 2 + 5)
      .attr("rx", 10)
      .attr("ry", 10)
      .attr(
        "fill",
        (d: any) =>
          d3.color(getNodeColor(d))?.copy({ opacity: 0.12 })?.formatRgb() ||
          "#f1f5f9"
      )
      .attr("stroke", "none");

    // CONTENT rect = white card
    nodeEnter
      .append("rect")
      .attr("class", "content-rect")
      .attr("width", this.rectX - 12) // inset further
      .attr("height", this.rectY - 12)
      .attr("x", 6)
      .attr("y", -this.rectY / 2 + 8)
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("fill", "#fff")
      .attr("stroke", "none")
      .attr("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.06))");

    // Icon background with group color
    nodeEnter
      .append("rect")
      .attr("x", 12)
      .attr("y", -this.rectY / 2 + 15)
      .attr("width", 32)
      .attr("height", 32)
      .attr("rx", 8)
      .attr("fill", (d: any) => getNodeColor(d));

    // Icon image
    nodeEnter
      .append("image")
      .attr("href", (d: any) => {
        if (d.data.model === "org") {
          return "/assets/icons/org-card-icon-item.svg";
        } else if (d.data.model === "group") {
          return "/assets/icons/group-card-icon-item.svg";
        } else {
          return "/assets/icons/asset-card-icon-item.svg";
        }
      })
      .attr("x", 16)
      .attr("y", -this.rectY / 2 + 18)
      .attr("width", 24)
      .attr("height", 24);

    // Title text (name)
    nodeEnter
      .append("text")
      .attr("x", 54)
      .attr("y", -this.rectY / 2 + 29)
      .attr("text-anchor", "start")
      .attr("font-size", "16px")
      .attr("font-weight", "600")
      .attr("fill", "#263238")
      .text((d: { data: { name: any } }) => {
        const name = d.data.name;
        return name.length > 18 ? name.substring(0, 18) + "..." : name;
      });

    // Subtitle (group/asset counts)
    nodeEnter
      .append("text")
      .attr("x", 54)
      .attr("y", -this.rectY / 2 + 44)
      .attr("text-anchor", "start")
      .attr("font-size", "13px")
      .attr("font-weight", "500")
      .attr("fill", "#64748B")
      .text((d: any) => {
        const g =
          d.data.groupCount !== undefined ? `G-${d.data.groupCount}` : "G-0";
        const a =
          d.data.assetCount !== undefined ? `A-${d.data.assetCount}` : "A-0";
        return `${g}/${a}`;
      });

    // Enter chevron
    nodeEnter
      .append("text")
      .attr("class", "expand-indicator")
      .attr("x", this.rectX + 12) // place at right edge
      .attr("y", 5) // vertical position relative to rect
      .attr("text-anchor", "middle")
      .attr("font-size", "20px")
      .attr("font-weight", "bold")
      .attr("fill", "#94A3B8")
      .attr("opacity", (d: any) => (d._children || d.children ? 1 : 0))
      .text("›");

    // Composite asset nodes for each parent
    // nodeEnter.each((d: any, i: number, nodes: any) => {
    //   const g = d3.select(nodes[i]);
    //   const assetChildren = d.data.children?.filter(
    //     (c: any) => c.model === "asset"
    //   );
    //   if (assetChildren && assetChildren.length > 0) {
    //     const cardWidth = 200;
    //     const rowHeight = 22;
    //     const cardHeight = 30 + assetChildren.length * rowHeight;
    //     const groupColor = getNodeColor(d);
    //     const assetGroup = g
    //       .append("g")
    //       .attr(
    //         "transform",
    //         `translate(${this.rectX + 40},${-cardHeight / 2})`
    //       );
    //     // Asset card box
    //     assetGroup
    //       .append("rect")
    //       .attr("width", cardWidth)
    //       .attr("height", cardHeight)
    //       .attr("rx", 10)
    //       .attr("ry", 10)
    //       .attr("fill", "#fff")
    //       .attr("stroke", groupColor)
    //       .attr("stroke-width", 2.5);
    //     // Asset list
    //     assetChildren.forEach((asset: any, idx: number) => {
    //       // Icon background
    //       assetGroup
    //         .append("rect")
    //         .attr("x", 12)
    //         .attr("y", 18 + idx * rowHeight)
    //         .attr("width", 24)
    //         .attr("height", 24)
    //         .attr("rx", 6)
    //         .attr("fill", groupColor);
    //       // Icon image
    //       assetGroup
    //         .append("image")
    //         .attr("href", "/assets/icons/asset-card-icon-item.svg")
    //         .attr("x", 16)
    //         .attr("y", 22 + idx * rowHeight)
    //         .attr("width", 16)
    //         .attr("height", 16);
    //       // Asset name/version
    //       assetGroup
    //         .append("text")
    //         .attr("x", 44)
    //         .attr("y", 34 + idx * rowHeight)
    //         .attr("font-size", "13px")
    //         .attr("font-weight", "500")
    //         .attr("fill", "#263238")
    //         .text(
    //           asset.version ? `${asset.name} (${asset.version})` : asset.name
    //         );
    //     });
    //     // Optional: connect line between group card and asset card
    //     g.append("line")
    //       .attr("x1", this.rectX)
    //       .attr("y1", 0)
    //       .attr("x2", this.rectX + 40)
    //       .attr("y2", 0)
    //       .attr("stroke", groupColor)
    //       .attr("stroke-width", 1.5);
    //   }
    // });

    // Transition nodes to their new position
    const nodeUpdate = node
      .merge(nodeEnter)
      .transition(transition)
      .attr("transform", (d: { y: any; x: any }) => `translate(${d.y},${d.x})`)
      .attr("fill-opacity", 1)
      .attr("stroke-opacity", 1);

    // Update chevron rotation
    node
      .merge(nodeEnter)
      .select(".expand-indicator")
      .transition(transition)
      .attr("transform", (d: any) => {
        const cx = this.rectX + 10; // same as .attr("x")
        const cy = 0; // same as .attr("y")
        return d.children
          ? `rotate(90, ${cx}, ${cy})`
          : `rotate(0, ${cx}, ${cy})`;
      })
      .attr("opacity", (d: any) => (d._children || d.children ? 1 : 0));
    // Transition exiting nodes
    const nodeExit = node
      .exit()
      .transition(transition)
      .remove()
      .attr("transform", (d: any) => `translate(${source.y},${source.x})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0);

    // Update the links
    const link = this.gLink
      .selectAll("path")
      .data(links, (d: { target: { id: any } }) => {
        return d.target.id;
      });

    // Enter new links
    const linkEnter = link
      .enter()
      .append("path")
      .attr("d", (d: any) => {
        const o = { x: source.x0, y: source.y0 };
        return this.diagonal({ source: o, target: o });
      });

    // Transition links to their new position
    link.merge(linkEnter).transition(transition).attr("d", this.diagonal);

    // Transition exiting links
    link
      .exit()
      .transition(transition)
      .remove()
      .attr("d", (d: any) => {
        const o = { x: source.x, y: source.y };
        return this.diagonal({ source: o, target: o });
      });

    // Stash old positions for transition
    this.root.eachBefore((d: { x0: any; x: any; y0: any; y: any }) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }
}
