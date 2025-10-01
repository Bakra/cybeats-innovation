import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { treeChartMockData } from '../charts-mock-data';
import * as d3 from 'd3';

@Component({
  selector: 'app-tree-chart',
  standalone: true,
  imports: [],
  templateUrl: './tree-chart.component.html',
  styleUrl: './tree-chart.component.scss'
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

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.margin = { top: 10, bottom: 10, left: 40, right: 10 };

    this.width = 928;
    this.renderTreeChart()
  }

  backToMain() {
    this.router.navigateByUrl('');

  }

  changeZoom(trent: string) {
    if (trent === '-') {
      this.width = this.width * 1.5;
    } else if (trent === '+') {
      this.width = this.width / 1.5;
    } else if (trent === 'reset') {
      this.width = 160 * this.root.height;
    }
    this.update(null, this.root);

  }

  renderTreeChart() {


    this.root = d3.hierarchy(this.chartData, (d) => { return d.children; });
    this.width = 160 * this.root.height;
    this.dx = 80;
    //size of rect item
    this.rectX = 200;
    this.rectY = this.dx / 2;

    this.dy = (this.width - this.margin.right - this.margin.left) / ((1 + this.root.height)) - this.dx;

    this.tree = d3.tree().nodeSize([this.dx, this.dy + this.rectX]);

    this.diagonal = d3.linkHorizontal().source((d) => {
      const dItem: any = d;
      return [dItem.source.y + this.rectX, dItem.source.x]
    }).target((d) => {
      const dItem: any = d;
      return [dItem.target.y, dItem.target.x]
    });

    this.svg = d3.select("figure#tree")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.dx)
      .attr("viewBox", [-this.margin.left, -this.margin.top, this.width, this.dx])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif; user-select: none;");


    this.gLink = this.svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

    this.gNode = this.svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");


    this.root.x0 = this.dy / 2;
    this.root.y0 = 0;
    this.root.descendants().forEach((d: { id: any; _children: any; children: null; depth: any; data: { name: string | any[]; }; }, i: any) => {
      d.id = i;
      if (!this.isPreview) {
        d._children = d.children;
        if (d.depth && d.data.name.length !== 7) d.children = null;
      }
    });

    this.update(null, this.root);
  }



  update(event: any, source: any) {
    const duration = event?.altKey ? 2500 : 500; // hold the alt key to slow down the transition
    const nodes = this.root.descendants().reverse();
    const links = this.root.links();

    // Compute the new tree layout.
    this.tree(this.root);

    let left = this.root;
    let right = this.root;
    this.root.eachBefore((node: any) => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });

    const height = right.x - left.x + this.margin.top + this.margin.bottom;

    const transition = this.svg.transition()
      .duration(duration)
      .attr("height", height + this.rectX)
      .attr("viewBox", [-this.margin.left, left.x - this.margin.top, this.width, height])
      .tween("resize", window.ResizeObserver ? null : () => () => this.svg.dispatch("toggle"));

    // Update the nodes…
    const node = this.gNode.selectAll("g")
      .data(nodes, (d: any) => d.id);

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append("g")
      .attr("transform", (d: any) => `translate(${source.y0},${source.x0})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)
      .on("click", (event: any, d: { children: any; _children: any; }) => {
        d.children = d.children ? null : d._children;
        this.update(event, d);
      })
      .on("mouseover", (event: any, d: { children: any; _children: any; depth: number }) => {
        // console.log({ depth: d.depth });
      });

    nodeEnter.append("rect")
      .attr("width", this.rectX)
      .attr("height", this.rectY)
      .attr("y", (d: { _children: any; }) => -this.rectY / 2)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("fill", (d: { _children: any; }) => d._children ? "#555" : "#999")
      .attr("stroke-width", 10);

    nodeEnter.append("text")
      .attr("dy", "0.31em")
      .attr("x", (d: { _children: any; }) => d._children ? this.rectX + 15 : this.rectX + 15)
      .attr("text-anchor", (d: { _children: any; }) => d._children ? "end" : "start")
      .text((d: { data: { name: any; }; }) => d.data.name)
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .attr("stroke", "white")
      .attr("paint-order", "stroke");

    // Transition nodes to their new position.
    const nodeUpdate = node.merge(nodeEnter).transition(transition)
      .attr("transform", (d: { y: any; x: any; }) => `translate(${d.y},${d.x})`)
      .attr("fill-opacity", 1)
      .attr("stroke-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    const nodeExit = node.exit().transition(transition).remove()
      .attr("transform", (d: any) => `translate(${source.y},${source.x})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0);

    // Update the links…
    const link = this.gLink.selectAll("path")
      .data(links, (d: { target: { id: any; }; }) => {
        return d.target.id
      });
    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().append("path")
      .attr("d", (d: any) => {
        const o = { x: source.x0, y: source.y0 };
        return this.diagonal({ source: o, target: o });
      });

    // Transition links to their new position.
    link.merge(linkEnter).transition(transition)
      .attr("d", this.diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition(transition).remove()
      .attr("d", (d: any) => {
        const o = { x: source.x, y: source.y };
        return this.diagonal({ source: o, target: o });
      });

    // Stash the old positions for transition.
    this.root.eachBefore((d: { x0: any; x: any; y0: any; y: any; }) => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }
}
