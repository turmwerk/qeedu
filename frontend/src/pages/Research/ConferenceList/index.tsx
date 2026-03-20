import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showcasePanelClass } from "@/feature/ScenarioShowcase";
import ConferenceDetailPage from "./DetailPage";
import ConferenceListPage from "./ListPage";
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

  return (
    <div
      className={
        embedded
          ? "flex min-w-0 flex-col gap-5"
          : "flex w-full min-w-0 flex-col gap-6 px-4 py-6 md:px-6 xl:px-8"
      }
    >
      <div className="flex flex-col gap-3">
        <div className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">
          {embedded ? "近期会议" : "会议列表"}
        </div>
        <div
          className={`font-black leading-tight text-[#243246] dark:text-white ${
            embedded ? "text-[28px] md:text-[42px]" : "text-[34px] md:text-[54px]"
          }`}
        >
          {embedded ? "近期会议与投稿待办" : "CCF 会议列表"}
        </div>
        <div className="max-w-[760px] text-[16px] leading-8 text-[#67748a] dark:text-[#dbe5f3]">
          {embedded
            ? "把近期摘要截止、全文截止和投稿待办直接放到科研首页顶部。左侧选会议，右侧看该会议的当前推进事项。"
            : "左侧按截止时间浏览近期会议，右侧查看当前会议的投稿待办与综述节奏。默认按最近截止排序，点击左侧卡片即可切换详情。"}
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.06fr)_minmax(420px,0.94fr)]">
        <div className={`${showcasePanelClass} overflow-hidden`}>
          <ConferenceListPage
            conferences={conferenceEntries}
            selectedConferenceId={selectedConferenceId}
            onSelectConference={handleSelectConference}
          />
        </div>
        <div className={`${showcasePanelClass} overflow-hidden`}>
          <ConferenceDetailPage conference={selectedConference} />
        </div>
      </section>
    </div>
  );
};

export default ConferenceList;
