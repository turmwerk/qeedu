import React, { useState } from "react";
import List from "@/components/List";
import Form from "@/components/Form";
import Model from "@/components/Model";
import ConfirmDialog from "@/components/ConfirmDialog";

type Outline = {
  id: string;
  title: string;
  subtitle?: string;
  md: string;
  createdAt?: number;
};

const ListPage: React.FC<{
  items: Outline[];
  onEdit: (id?: string) => void;
  onCreate: (payload: { name: string; goals: string; weeks: number }) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
}> = ({ items, onEdit, onCreate, onDelete, onRename }) => {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteTitle, setConfirmDeleteTitle] = useState<string>("");
  return (
    <div>
      <div className="p-6 text-[#444]">
        <div className="grid grid-cols-1 gap-5 items-start">
          <div>
            <div className="bg-white/40 backdrop-blur-[16px] rounded-xl p-[18px] shadow-[0_8px_32px_rgba(147,51,234,0.12)] border border-white/40 min-h-[520px]">
              <div className="flex justify-between items-center font-bold mb-3">
                <div className="text-[var(--brand-accent)] font-bold">
                  已创建的大纲 ({items.length})
                </div>
                <div>
                  <button
                    className="bg-white border border-[var(--brand-border)] text-[var(--brand-accent)] px-2.5 py-1.5 rounded-xl cursor-pointer font-semibold transition-[background,border-color,box-shadow] hover:bg-[var(--brand-accent-soft)] hover:border-[var(--brand-accent)] hover:shadow-[var(--brand-shadow)]"
                    onClick={() => setOpen(true)}
                  >
                    新建大纲
                  </button>
                </div>
              </div>
              <div className="p-3">
                <List
                  items={items}
                  keyExtractor={(i: any) => i.id}
                  editable={{ getValue: (i: any) => i.title }}
                  renderItem={(item: any) => (
                    <>
                      <div className="font-bold text-[#2d1b4f]">
                        {item.title}
                      </div>
                      <div className="mt-1.5 flex gap-3 items-center">
                        {item.subtitle && (
                          <span className="text-[#888]">{item.subtitle}</span>
                        )}
                        {item.createdAt && (
                          <span className="text-[#999] text-[12px]">
                            {new Date(item.createdAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                  actions={[
                    {
                      label: "继续编辑",
                      onClick: (item: any) => onEdit(item.id),
                      className:
                        "bg-[var(--brand-accent)] text-white border-0 px-2.5 py-1.5 rounded-lg cursor-pointer font-semibold hover:bg-[var(--brand-accent-strong)]",
                    },
                    {
                      label: "重命名",
                      isRename: true,
                      onClick: (item: any, newName?: string) =>
                        newName && onRename(item.id, newName),
                      className:
                        "bg-[var(--brand-accent-soft)] text-[var(--brand-accent)] border border-[var(--brand-border)] px-2.5 py-1.5 rounded-lg cursor-pointer font-semibold hover:bg-[var(--brand-accent-faint)]",
                    },
                    {
                      label: "删除",
                      onClick: (item: any) => {
                        setConfirmDeleteId(item.id);
                        setConfirmDeleteTitle(item.title || "未命名课程");
                      },
                      className:
                        "bg-white border border-[rgba(200,30,30,0.16)] text-[#b02a37] px-2.5 py-1.5 rounded-lg cursor-pointer font-semibold hover:bg-[#ffecec] hover:border-[#f1a1a1]",
                    },
                  ]}
                  emptyText="暂无课程大纲。"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Model
        visible={open}
        title="新建课程大纲"
        width={1000}
        onClose={() => setOpen(false)}
      >
        <div>
          <p className="text-[#666]">
            简要表单保证必填槽位，然后进入双栏协作。
          </p>
          <div className="mt-3">
            <Form
              mode="table"
              fields={[
                {
                  name: "name",
                  label: "课程名称",
                  placeholder: "例如： 机器学习导论",
                  span: 1,
                },
                {
                  name: "englishName",
                  label: "英文课程名",
                  placeholder: "例如： Introduction to ML",
                  span: 1,
                },

                {
                  name: "courseId",
                  label: "课程号",
                  placeholder: "例如： 90111205",
                  span: 1,
                },
                {
                  name: "unit",
                  label: "开课单位",
                  placeholder: "例如： 计算机学院",
                  span: 1,
                },

                {
                  name: "responsible",
                  label: "课程负责人",
                  placeholder: "例如： 张三",
                  span: 1,
                },
                {
                  name: "writerName",
                  label: "大纲填写人",
                  placeholder: "例如： 张三",
                  span: 1,
                },

                {
                  name: "publicElectiveCategory",
                  label: "通识公选类别",
                  placeholder: "如：自然科学类",
                },
                {
                  name: "generalEducationCategory",
                  label: "通修课程类别",
                  placeholder: "如：计算机基础",
                },

                {
                  name: "collegeCourseCategory",
                  label: "院内课程分类",
                  placeholder: "如：专业核心课",
                },
                {
                  name: "courseCategory",
                  label: "课程类别",
                  placeholder: "如：学科基础课程",
                  defaultValue: "学科基础课程",
                },

                {
                  name: "courseLevel",
                  label: "课程层次",
                  placeholder: "如：本科生",
                },
                {
                  name: "courseStatus",
                  label: "课程状态",
                  placeholder: "如：运行中",
                  defaultValue: "运行中",
                },

                {
                  name: "theoryPracticeType",
                  label: "理论/实践",
                  placeholder: "如：理论+实验课程",
                  defaultValue: "理论+实验课程",
                },
                {
                  name: "examType",
                  label: "考试类型",
                  type: "select",
                  options: [
                    { label: "闭卷", value: "闭卷" },
                    { label: "开卷", value: "开卷" },
                    { label: "大作业", value: "大作业" },
                  ],

                  defaultValue: "闭卷",
                },

                {
                  name: "crossSemester",
                  label: "跨学期课程",
                  type: "select",
                  options: [
                    { label: "否", value: "否" },
                    { label: "是", value: "是" },
                  ],

                  defaultValue: "否",
                },
                {
                  name: "credits",
                  label: "学分",
                  type: "number",
                  defaultValue: 3,
                },

                {
                  name: "totalHours",
                  label: "总学时",
                  type: "number",
                  defaultValue: 48,
                },
                {
                  name: "theoryHours",
                  label: "理论学时",
                  type: "number",
                  defaultValue: 32,
                },

                {
                  name: "practiceHours",
                  label: "实践学时",
                  type: "number",
                  defaultValue: 16,
                },
                {
                  name: "experimentHours",
                  label: "实验学时",
                  type: "number",
                  defaultValue: 0,
                },

                {
                  name: "intensiveWeeks",
                  label: "集中实践周数",
                  type: "number",
                  defaultValue: 0,
                },
                {
                  name: "isEnglish",
                  label: "全英文授课",
                  type: "select",
                  options: [
                    { label: "否", value: "否" },
                    { label: "是", value: "是" },
                  ],

                  defaultValue: "否",
                },

                {
                  name: "isBilingual",
                  label: "双语授课",
                  type: "select",
                  options: [
                    { label: "否", value: "否" },
                    { label: "是", value: "是" },
                  ],

                  defaultValue: "否",
                  span: 2,
                },

                {
                  name: "goals",
                  label: "课程育人目标",
                  type: "textarea",
                  placeholder: "简述课程育人目标",
                  rows: 4,
                  span: 2,
                },
                {
                  name: "teachingGoals",
                  label: "课程教学目标",
                  type: "textarea",
                  placeholder: "简述课程教学目标",
                  rows: 4,
                  span: 2,
                },
                {
                  name: "alignmentGoals",
                  label: "与培养目标契合度",
                  type: "textarea",
                  placeholder: "与学校本科人才培养目标的契合关系",
                  rows: 3,
                  span: 2,
                },
                {
                  name: "intro",
                  label: "课程简介",
                  type: "textarea",
                  placeholder: "课程简介",
                  rows: 4,
                  span: 2,
                },
                {
                  name: "textbooks",
                  label: "教材",
                  type: "textarea",
                  placeholder: "教材信息",
                  span: 2,
                },
                {
                  name: "references",
                  label: "参考资料",
                  type: "textarea",
                  placeholder: "参考资料信息",
                  span: 2,
                },
                {
                  name: "grading",
                  label: "成绩构成",
                  type: "textarea",
                  placeholder: "成绩构成说明",
                  span: 2,
                },
                { name: "notes", label: "备注", type: "textarea", span: 2 },
              ]}
              submitText="生成初稿"
              submitLoading={isCreating}
              submitLoadingText="生成中"
              submitDisabled={isCreating}
              onSubmit={(values) => {
                if (isCreating) return;
                setIsCreating(true);
                setTimeout(() => {
                  onCreate(values as any);
                  setOpen(false);
                  setIsCreating(false);
                }, 600);
              }}
            />
          </div>
        </div>
      </Model>

      <ConfirmDialog
        open={!!confirmDeleteId}
        title="删除课程大纲"
        description={`确认删除「${confirmDeleteTitle}」吗？此操作不可恢复。`}
        confirmText="确认删除"
        danger
        onCancel={() => {
          setConfirmDeleteId(null);
          setConfirmDeleteTitle("");
        }}
        onConfirm={() => {
          if (confirmDeleteId) onDelete(confirmDeleteId);
          setConfirmDeleteId(null);
          setConfirmDeleteTitle("");
        }}
      />
    </div>
  );
};

export default ListPage;
