import { Component, Input } from "@angular/core";
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
  svg: any;
  gLink: any;
  gNode: any;
  diagonal: any;

  width: number;
  margin: any = { top: 100, bottom: 100, left: 100, right: 100 };
  duration: number = 750;

  rectX: number = 240;
  rectY: number = 60;
  dx: number = 140;
  dy: number = 400;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.width = 928;
    this.renderTreeChart();
  }

  backToMain() {
    this.router.navigateByUrl("");
  }

  changeZoom(trent: string) {
    if (trent === "-") this.width = this.width * 1.5;
    else if (trent === "+") this.width = this.width / 1.5;
    else if (trent === "reset") this.width = 300 * this.root.height;

    this.update(null, this.root);
  }

  renderTreeChart() {
    this.root = d3.hierarchy(this.chartData, (d) => d.children);

    this.width = Math.max(window.innerWidth, 350 * this.root.height);

    this.tree = d3.tree().nodeSize([this.dx, this.dy]);

    this.diagonal = d3
      .linkHorizontal()
      .source((d: any) => [d.source.y + this.rectX, d.source.x])
      .target((d: any) => [d.target.y, d.target.x]);

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

    const colors = [
      "#9C27B0",
      "#43C6AC",
      "#FF9800",
      "#2196F3",
      "#E91E63",
      "#009688",
      "#673AB7",
      "#FF5722",
    ];

    this.root.descendants().forEach((d: any, i: any) => {
      d.id = i;
      if (d.depth === 1) d.data.groupColor = colors[i % colors.length];
      else if (d.depth > 1) {
        let parent = d.parent;
        while (parent && !parent.data.groupColor) parent = parent.parent;
        if (parent && parent.data.groupColor)
          d.data.groupColor = parent.data.groupColor;
      } else if (d.depth === 0) d.data.groupColor = "#999";

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
      ]);

    const node = this.gNode.selectAll("g").data(nodes, (d: any) => d.id);

    const nodeEnter = node
      .enter()
      .append("g")
      .attr("transform", (d: any) => `translate(${source.y0},${source.x0})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)
      .on("click", (event: any, d: any) => {
        d.children = d.children ? null : d._children;
        this.update(event, d);
      });

    const getNodeColor = (d: any) => d.data.groupColor || "#999";

    // OUTER border
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

    // INNER shade
    nodeEnter
      .append("rect")
      .attr("class", "inner-shade")
      .attr("width", this.rectX - 6)
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

    // Content card
    nodeEnter
      .append("rect")
      .attr("class", "content-rect")
      .attr("width", this.rectX - 12)
      .attr("height", this.rectY - 12)
      .attr("x", 6)
      .attr("y", -this.rectY / 2 + 8)
      .attr("rx", 8)
      .attr("ry", 8)
      .attr("fill", "#fff")
      .attr("stroke", "none")
      .attr("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.06))");

    // Icon background
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
        if (d.data.model === "org")
          return "/assets/icons/org-card-icon-item.svg";
        else if (d.data.model === "group")
          return "/assets/icons/group-card-icon-item.svg";
        return "/assets/icons/asset-card-icon-item.svg";
      })
      .attr("x", 16)
      .attr("y", -this.rectY / 2 + 18)
      .attr("width", 24)
      .attr("height", 24);

    // Title text
    nodeEnter
      .append("text")
      .attr("x", 54)
      .attr("y", -this.rectY / 2 + 29)
      .attr("text-anchor", "start")
      .attr("font-size", "16px")
      .attr("font-weight", "600")
      .attr("fill", "#263238")
      .text((d: any) =>
        d.data.name.length > 18
          ? d.data.name.substring(0, 18) + "..."
          : d.data.name
      );

    // Subtitle
    nodeEnter
      .append("text")
      .attr("x", 54)
      .attr("y", -this.rectY / 2 + 44)
      .attr("text-anchor", "start")
      .attr("font-size", "13px")
      .attr("font-weight", "500")
      .attr("fill", "#64748B")
      .text(
        (d: any) => `G-${d.data.groupCount || 0}/A-${d.data.assetCount || 0}`
      );

    // Conditional expand circle and chevron
    nodeEnter.each((d: any, i: number, nodes: any) => {
      if (d._children || d.children) {
        const g = d3.select(nodes[i]);

        g.append("circle")
          .attr("class", "expand-circle")
          .attr("cx", this.rectX + 16)
          .attr("cy", 0)
          .attr("r", 12)
          .attr("fill", "#f1f5f9")
          .attr("stroke", "#cbd5e1");

        g.append("text")
          .attr("class", "expand-indicator")
          .attr("x", this.rectX + 16)
          .attr("y", 5)
          .attr("text-anchor", "middle")
          .attr("font-size", "20px")
          .attr("font-weight", "bold")
          .attr("fill", "#64748B")
          .text("›");
      }
    });

    // Merge and transition nodes
    const nodeUpdate = node
      .merge(nodeEnter)
      .transition(transition)
      .attr("transform", (d: any) => `translate(${d.y},${d.x})`)
      .attr("fill-opacity", 1)
      .attr("stroke-opacity", 1);

    node
      .merge(nodeEnter)
      .select(".expand-indicator")
      .transition(transition)
      .attr("transform", (d: any) => {
        const cx = this.rectX + 16;
        const cy = 0;
        return d.children
          ? `rotate(90, ${cx}, ${cy})`
          : `rotate(0, ${cx}, ${cy})`;
      })
      .attr("opacity", (d: any) => (d._children || d.children ? 1 : 0));

    const nodeExit = node
      .exit()
      .transition(transition)
      .remove()
      .attr("transform", (d: any) => `translate(${source.y},${source.x})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0);

    const link = this.gLink
      .selectAll("path")
      .data(links, (d: any) => d.target.id);

    const linkEnter = link
      .enter()
      .append("path")
      .attr("d", (d: any) => {
        const o = { x: source.x0, y: source.y0 };
        return this.diagonal({ source: o, target: o });
      });

    link.merge(linkEnter).transition(transition).attr("d", this.diagonal);

    link
      .exit()
      .transition(transition)
      .remove()
      .attr("d", (d: any) => {
        const o = { x: source.x, y: source.y };
        return this.diagonal({ source: o, target: o });
      });

    this.root.eachBefore((d: any) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }
}
