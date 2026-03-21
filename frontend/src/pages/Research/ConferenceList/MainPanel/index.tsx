import React from "react";
import ConferenceDetailPage from "../DetailPage";
import ConferenceListPage from "../ListPage";
import type { ConferenceEntry } from "../data";
import {
  workbenchMainPanelShellClassName,
  workbenchScrollAreaClassName,
} from "@/pages/shared/workbench";

type Props = {
  conferences: ConferenceEntry[];
  selectedConference: ConferenceEntry;
  selectedConferenceId: string;
  onSelectConference: (conferenceId: string) => void;
};

const MainPanel: React.FC<Props> = ({
  conferences,
  selectedConference,
  selectedConferenceId,
  onSelectConference,
}) => (
  <div className={workbenchMainPanelShellClassName}>
    <div className={workbenchScrollAreaClassName}>
      <div className="grid min-h-full gap-6 xl:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
        <div className="rounded-[28px] border border-slate-200 bg-white/66 dark:border-white/10 dark:bg-white/6">
          <ConferenceListPage
            conferences={conferences}
            selectedConferenceId={selectedConferenceId}
            onSelectConference={onSelectConference}
          />
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white/66 dark:border-white/10 dark:bg-white/6">
          <ConferenceDetailPage conference={selectedConference} />
        </div>
      </div>
    </div>
  </div>
);

export default MainPanel;
