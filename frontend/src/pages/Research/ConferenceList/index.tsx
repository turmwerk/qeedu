import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { WorkspacePageFrame } from "@/pages/shared/workbench";
import AssistantPanel from "./AssistantPanel";
import HeroSection from "./HeroSection";
import MainPanel from "./MainPanel";
import { conferenceEntries, findConferenceById } from "./data";

type Props = {
  embedded?: boolean;
};

const ConferenceList: React.FC<Props> = ({ embedded = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [embeddedSelectedConferenceId, setEmbeddedSelectedConferenceId] = useState(
    conferenceEntries[0]?.id ?? "",
  );

  const routeSelectedConferenceId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return findConferenceById(params.get("conference"))?.id ?? conferenceEntries[0]?.id ?? "";
  }, [location.search]);

  useEffect(() => {
    if (!embedded) return;
    setEmbeddedSelectedConferenceId(routeSelectedConferenceId);
  }, [embedded, routeSelectedConferenceId]);

  const selectedConferenceId = embedded
    ? embeddedSelectedConferenceId || conferenceEntries[0]?.id || ""
    : routeSelectedConferenceId;

  const selectedConference = useMemo(
    () => conferenceEntries.find((conference) => conference.id === selectedConferenceId) ?? conferenceEntries[0],
    [selectedConferenceId],
  );

  const handleSelectConference = (conferenceId: string) => {
    if (embedded) {
      setEmbeddedSelectedConferenceId(conferenceId);
      return;
    }
    const params = new URLSearchParams(location.search);
    params.set("conference", conferenceId);
    navigate(`/research/conference-list?${params.toString()}`);
  };

  if (!selectedConference) {
    return null;
  }

  if (embedded) {
    return (
      <div className="flex min-w-0 flex-col gap-5">
        <HeroSection embedded selectedConference={selectedConference} />
        <div className="min-h-[760px] min-w-0">
          <WorkspacePageFrame
            header={null}
            initialSplit={64}
            minSplit={48}
            maxSplit={76}
            left={
              <MainPanel
                conferences={conferenceEntries}
                selectedConference={selectedConference}
                selectedConferenceId={selectedConferenceId}
                onSelectConference={handleSelectConference}
              />
            }
            right={<AssistantPanel conference={selectedConference} />}
          />
        </div>
      </div>
    );
  }

  return (
    <WorkspacePageFrame
      header={<HeroSection selectedConference={selectedConference} />}
      initialSplit={64}
      minSplit={48}
      maxSplit={76}
      left={
        <MainPanel
          conferences={conferenceEntries}
          selectedConference={selectedConference}
          selectedConferenceId={selectedConferenceId}
          onSelectConference={handleSelectConference}
        />
      }
      right={<AssistantPanel conference={selectedConference} />}
    />
  );
};

export default ConferenceList;
