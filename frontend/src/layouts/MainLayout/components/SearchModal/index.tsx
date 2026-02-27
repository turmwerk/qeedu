import React, { useRef } from "react";
import { Modal, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ open, onClose }) => {
  const inputRef = useRef<InputRef>(null);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <span className="inline-flex items-center gap-2 text-[var(--brand-text)]">
          <SearchOutlined />
          搜索
        </span>
      }
      centered
      rootClassName="search-modal"
      afterOpenChange={(visible) => {
        if (visible) {
          // 打开后自动聚焦输入框
          setTimeout(() => inputRef.current?.focus(), 50);
        }
      }}
    >
      <div className="p-2">
        <Input
          ref={inputRef}
          size="large"
          placeholder="输入即搜索"
        />
      </div>
    </Modal>
  );
};

export default SearchModal;
