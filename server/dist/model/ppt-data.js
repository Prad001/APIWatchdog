"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data = {
    "slides": [
        {
            "title": "Consult-AI Architecture",
            "contents": [
                {
                    "type": "heading",
                    "text": "Consult-AI Architecture"
                },
                {
                    "type": "sub-heading",
                    "text": "AI-Powered PPT Generation Platform"
                },
                {
                    "type": "created-by",
                    "text": "Pradeep Shelke - Research Associate, ApTSi"
                },
                {
                    "type": "create-date",
                    "text": "Date: May 25, 2025"
                }
            ]
        },
        {
            "title": "Introduction",
            "contents": [
                {
                    "type": "heading",
                    "text": "What is Consult-AI?"
                },
                {
                    "type": "description",
                    "text": "Consult-AI is an intelligent platform that transforms user prompts into fully structured PowerPoint presentations. By leveraging a combination of a custom AI model and a company-specific knowledge base, it streamlines architecture documentation and knowledge transfer."
                }
            ]
        },
        {
            "title": "Key Features",
            "contents": [
                {
                    "type": "bullet",
                    "items": [
                        "Prompt-to-PPT pipeline with Angular UI",
                        "AI-generated content structured in JSON",
                        "Mermaid diagrams for architectural flows",
                        "Knowledge base integration via Vector DB",
                        "Export-ready PPT using pptxgenjs"
                    ]
                }
            ]
        },
        {
            "title": "System Architecture Flow",
            "contents": [
                {
                    "type": "mermaid",
                    "diagramType": "flowchart",
                    "diagramTitle": "Consult-AI Architecture",
                    "script": `flowchart TD
 subgraph Frontend["Frontend"]
        A1["User Prompt Input - Angular UI"]
        A2["Send Request to Express API"]
        A3["Receive JSON Response"]
        A4["Generate PPT with pptxgenjs"]
  end
 subgraph Backend["Backend"]
        B1["Express.js Server"]
        B2["Forward Prompt to AI Engine"]
        B3["Return JSON-formatted Slide Data"]
  end
 subgraph AI_Engine["AI_Engine"]
        C1["Prompt Handler"]
        C2["Query Vector DB (Company + General Knowledge)"]
        C3["AI Model - Content Generator"]
        C4["Generate Slide JSON Format"]
  end
 subgraph Assets["Assets"]
        D1["Company Knowledge Base - Vector DB"]
        D2["Predefined Images / Diagrams"]
  end
    A1 --> A2
    A2 --> B1
    B1 --> B2
    B2 --> C1
    C1 --> C2 & C3
    C2 --> D1
    C3 --> C4 & Assets
    C4 --> B3
    B3 --> A3
    A3 --> A4
    AI_Engine --> n1["Untitled Node"]

    style A1 fill:#c1e1c1,stroke:#333,stroke-width:1px
    style A4 fill:#c1e1c1,stroke:#333,stroke-width:1px
    style B1 fill:#f9f,stroke:#333,stroke-width:1px
    style B2 fill:#f9f,stroke:#333,stroke-width:1px
    style B3 fill:#f9f,stroke:#333,stroke-width:1px
    style C1 fill:#cff,stroke:#333,stroke-width:1px
    style C2 stroke-width:1px
    style C4 fill:#cff,stroke:#333,stroke-width:1px
    style D1 fill:#ffd,stroke:#333,stroke-width:1px
    style D2 fill:#ffd,stroke:#333,stroke-width:1px`
                }
            ]
        },
        {
            "title": "Benefits",
            "contents": [
                {
                    "type": "heading",
                    "text": "Key Benefits of Consult-AI"
                },
                {
                    "type": "bullet",
                    "items": [
                        "Automates PPT creation, saving time for technical teams",
                        "Company-specific and general knowledge blended into output",
                        "Consistent, structured presentations with diagrams",
                        "Easily extendable to support new models and formats"
                    ]
                },
                {
                    "type": "description",
                    "text": "By bridging user prompts with company knowledge and visual storytelling, Consult-AI boosts productivity and ensures knowledge retention across teams."
                }
            ]
        },
        {
            "title": "Conclusion",
            "contents": [
                {
                    "type": "heading",
                    "text": "Towards Smarter Documentation"
                },
                {
                    "type": "bullet",
                    "items": [
                        "Consult-AI reduces manual effort in architecture reporting.",
                        "It empowers consultants with intelligent tooling.",
                        "Its modular design allows future AI upgrades."
                    ]
                },
                {
                    "type": "description",
                    "text": "This architecture enables smart knowledge flow in enterprises by combining automation, visualization, and domain expertise."
                }
            ]
        }
    ]
};
exports.default = data;
