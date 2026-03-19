import React from "react";
import Button from "@/ui/Button";
import { ShowcaseTag, showcasePanelClass } from "@/feature/ScenarioShowcase";
import { SearchOutlinedIcon } from "@/ui/Icon";

const selectedPapers = [
  {
    title: "Anchoring Effects in AI-Assisted Sketch Ideation",
    meta: "Wu, Santos, Meyer · UIST 2024",
    badge: "Included",
  },
  {
    title: "Timing Matters: Intervention Schedules for Human-AI Co-Creation",
    meta: "Liu, Park, Ahmed · CHI 2025",
    badge: "Compared",
  },
  {
    title: "Flow and Friction in Prompt-Driven Design Workflows",
    meta: "Kim, Ortega, Bell · DIS 2024",
    badge: "Open",
  },
];

const LiteratureSearch: React.FC = () => {
  return (
    <div className="flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8">
      <div className="text-[34px] font-black leading-tight text-[#243246] md:text-[64px] dark:text-white">
        文献检索与综述助手
      </div>

      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-[#6177ff] text-[26px] font-black text-white">
            R
          </div>
          <div>
            <div className="text-[18px] font-black text-[#243246] dark:text-white">Research Assistant</div>
            <div className="text-[15px] text-[#67748a] dark:text-[#dbe5f3]">Discovery Workspace</div>
          </div>
          <div className="min-w-0 flex-1">
            <div className={`${showcasePanelClass} flex h-14 items-center gap-3 px-5 py-0`}>
              <SearchOutlinedIcon className="text-[#94a3b8]" />
              <span className="truncate text-[16px] text-[#67748a] dark:text-[#dbe5f3]">
                Search papers, authors, themes, or notes
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button className="rounded-[20px] border border-[#dbe1f3] bg-white px-5 py-3 text-sm font-semibold text-[#334155]">HCI Project</Button>
          <Button className="rounded-[20px] border border-[#dbe1f3] bg-white px-5 py-3 text-sm font-semibold text-[#334155]">Saved</Button>
          <Button className="rounded-[20px] bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white">Export</Button>
        </div>
      </section>

      <section className={`${showcasePanelClass} grid gap-6 p-6 xl:grid-cols-[320px_minmax(0,1.2fr)_340px]`}>
        <div className="space-y-4">
          <div className={`${showcasePanelClass} p-5`}>
            <div className="flex items-start justify-between gap-3">
              <div className="text-[22px] font-black text-[#243246] dark:text-white">Advanced Retrieval</div>
              <div className="text-[15px] text-[#67748a] dark:text-[#dbe5f3]">Web of Science style</div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <ShowcaseTag>TS=Topic</ShowcaseTag>
              <ShowcaseTag tone="gray">PY=2020-2026</ShowcaseTag>
              <ShowcaseTag tone="gray">LANG=EN</ShowcaseTag>
            </div>
            <div className="mt-4 rounded-[22px] border border-[#dbe1f3] border-l-[4px] border-l-[#6177ff] bg-white/76 p-4 text-[16px] leading-8 text-[#475569] dark:border-white/10 dark:bg-white/6 dark:text-[#dbe5f3]">
              TS=((&quot;generative AI&quot; OR &quot;AI assistant&quot;) AND (creative workflow OR sketch* OR design ideation) AND (timing OR intervention OR flow disruption OR autonomy))
            </div>
            <div className="mt-4 flex gap-3">
              <Button className="rounded-[20px] border border-[#dbe1f3] bg-white px-5 py-3 text-sm font-semibold text-[#334155]">Edit Query</Button>
              <Button className="rounded-[20px] bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white">Search</Button>
            </div>
          </div>
          {["Refine Results", "Document Type", "Research Areas", "Source Titles", "Language & Access"].map((item) => (
            <div key={item} className={`${showcasePanelClass} flex items-center justify-between px-5 py-4`}>
              <div className="text-[16px] font-bold text-[#243246] dark:text-white">{item}</div>
              <span className="text-[#94a3b8]">▾</span>
            </div>
          ))}
        </div>

        <div className="space-y-5">
          <div className={`${showcasePanelClass} p-5`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">LLM Research Copilot</div>
                <div className="mt-2 text-[22px] font-black text-[#243246] dark:text-white">Literature Review Conversation</div>
              </div>
              <div className="rounded-[20px] border border-[#dbe1f3] bg-white px-4 py-3 text-sm font-semibold text-[#334155] dark:border-white/10 dark:bg-white/6 dark:text-white">
                GPT-4.1 · Balanced reasoning and speed
              </div>
            </div>
          </div>
          <div className={`${showcasePanelClass} space-y-5 p-5`}>
            <div className="flex justify-center">
              <ShowcaseTag tone="gray">Current session</ShowcaseTag>
            </div>
            <div className={`${showcasePanelClass} p-5`}>
              <div className="text-[14px] font-semibold text-[#67748a] dark:text-[#dbe5f3]">Researcher · 10:12 AM</div>
              <div className="mt-3 text-[18px] leading-9 text-[#243246] dark:text-white">
                I want to understand how the <strong>timing of generative AI intervention</strong> affects user experience in creative workflows. Please narrow the scope, suggest a search strategy, and tell me what themes I should pay attention to.
              </div>
            </div>
            <div className={`${showcasePanelClass} p-5`}>
              <div className="text-[14px] font-semibold text-[#67748a] dark:text-[#dbe5f3]">Research Copilot · 10:13 AM</div>
              <div className="mt-3 text-[18px] leading-9 text-[#243246] dark:text-white">
                I refined your question into three operational dimensions: <strong>when the intervention happens, what form the intervention takes, and which user-experience outcome is affected.</strong> The strongest candidate themes are autonomy, anchoring, flow disruption, reflective prompting, and creative ownership.
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <ShowcaseTag>6 papers on autonomy</ShowcaseTag>
                <ShowcaseTag>4 papers on anchoring</ShowcaseTag>
                <ShowcaseTag>3 papers on flow</ShowcaseTag>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {[
                  ["Suggested scope", "Focus on drawing, sketching, and collaborative ideation instead of all generative-AI creativity tasks."],
                  ["Search strategy", "Combine generative AI timing terms with creative-workflow and intervention-related expressions."],
                  ["Next step", "Screen papers discussing early-stage ideation, reflective prompting, and workflow interruption."],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-[22px] border border-[#dbe1f3] bg-white/76 p-4 dark:border-white/10 dark:bg-white/6">
                    <div className="text-[16px] font-black text-[#243246] dark:text-white">{title}</div>
                    <div className="mt-2 text-[14px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">{text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={`${showcasePanelClass} p-5`}>
          <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Selected Papers</div>
          <div className="mt-4 space-y-4">
            {selectedPapers.map((paper) => (
              <div key={paper.title} className="rounded-[22px] border border-[#dbe1f3] bg-white/76 p-4 dark:border-white/10 dark:bg-white/6">
                <div className="text-[16px] font-black text-[#243246] dark:text-white">{paper.title}</div>
                <div className="mt-2 text-[15px] leading-7 text-[#67748a] dark:text-[#dbe5f3]">{paper.meta}</div>
                <div className="mt-3">
                  <ShowcaseTag tone={paper.badge === "Included" ? "green" : paper.badge === "Compared" ? "blue" : "orange"}>
                    {paper.badge}
                  </ShowcaseTag>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Remove", "Open", "Preview"].map((action) => (
                    <Button key={`${paper.title}-${action}`} className="rounded-full border border-[#dbe1f3] bg-white px-4 py-2 text-sm font-semibold text-[#334155]">
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {["Export BibTeX", "Export EndNote", "Copy APA", "Copy Chicago"].map((item) => (
              <Button key={item} className="rounded-[20px] border border-[#dbe1f3] bg-white px-4 py-3 text-sm font-semibold text-[#334155]">
                {item}
              </Button>
            ))}
          </div>
          <Button className="mt-4 w-full rounded-[20px] bg-[var(--brand-blue)] px-5 py-3 text-sm font-semibold text-white">
            Add all to draft
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LiteratureSearch;
