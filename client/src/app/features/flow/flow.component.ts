import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, AfterViewInit, Inject, PLATFORM_ID, ViewChild, ElementRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import mermaid from 'mermaid';
import pako from 'pako';
import { ApiService } from '../../core/service/api.service';
import { FlowItem, APIWatchdogReport } from '../../../models/api-watchdog.model';

@Component({
  selector: 'app-flow',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.scss']
})
export class FlowComponent implements OnInit, AfterViewInit {
  @ViewChild("mermaidContainer", { static: false }) mermaidContainer!: ElementRef;

  flowSection: FlowItem[] = [];
  selectedFlow: FlowItem | null = null;

  activeTab: 'diagram' | 'script' = 'diagram';
  theme: 'dark' | 'default' = 'dark';
  private svgContent: string = '';

  isDropdownOpen = false;
  loading = true;
  error: string | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private apiService: ApiService
  ) {}

ngOnInit(): void {
  this.apiService.report$.subscribe(report => {
    if (report?.flows?.flows) {
      this.flowSection = report.flows.flows;
      this.selectedFlow = this.flowSection[0] ?? null;

      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => this.renderMermaid(), 0);
      }
    }
  });
}


  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.renderMermaid();
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectFlow(flow: FlowItem) {
    this.selectedFlow = flow;
    this.isDropdownOpen = false;

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.renderMermaid(), 0);
    }
  }

  setActiveTab(tab: 'diagram' | 'script') {
    this.activeTab = tab;
    if (tab === 'diagram' && isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.renderMermaid(), 0);
    }
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'default' : 'dark';
    this.renderMermaid();
  }

  async renderMermaid(): Promise<void> {
    if (!this.mermaidContainer || !this.selectedFlow) return;

    const definition = this.selectedFlow.mermaidScript || "graph TD; A-->B;";

    mermaid.initialize({
      startOnLoad: false,
      theme: this.theme,
    });

    try {
      const renderId = "mermaid-svg-" + Date.now();
      const { svg } = await mermaid.render(renderId, definition);
      this.mermaidContainer.nativeElement.innerHTML = svg;
      this.svgContent = svg;
      this.cdr.detectChanges();
    } catch (err) {
      console.error("Mermaid render error:", err);
    }
  }

  downloadPNG() {
    if (!this.svgContent) return;

    const svg = new Blob([this.svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svg);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = this.theme === "dark" ? "#111827" : "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "mermaid-diagram.png";
          link.click();
        }
      });
    };
    img.src = url;
  }

  downloadSVG() {
    if (!this.svgContent) return;

    const blob = new Blob([this.svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "mermaid-diagram.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  // 👇 Open Mermaid Playground
  openInMermaidPlayground() {
    if (!this.selectedFlow?.mermaidScript) return;

    const state = {
      code: this.selectedFlow.mermaidScript,
      mermaid: { theme: this.theme }
    };

    const json = JSON.stringify(state);
    const compressed = pako.deflate(json);

    let binary = "";
    const CHUNK = 0x8000;
    for (let i = 0; i < compressed.length; i += CHUNK) {
      const sub = compressed.subarray(i, i + CHUNK);
      binary += String.fromCharCode.apply(null, sub as unknown as number[]);
    }
    const base64 = btoa(binary);

    const url = `https://mermaid.live/edit#pako:${base64}`;
    window.open(url, "_blank");
  }
}
