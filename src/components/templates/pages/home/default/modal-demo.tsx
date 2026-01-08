"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CommonModal, CommonModalComponent } from "@/components/common/modal";

/**
 * 对话框演示组件
 * 展示两种使用方式的区别：
 * 1. CommonModalComponent - 组件方式（支持 SSR）
 * 2. CommonModal - 函数式调用（仅客户端）
 */
export function ModalDemo() {
  const [componentModalOpen, setComponentModalOpen] = useState(false);

  // 函数式调用方式
  const handleFunctionModal = () => {
    CommonModal({
      title: "函数式调用对话框",
      width: "50%",
      content: (close) => (
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name-func">名称</Label>
            <Input id="name-func" placeholder="输入名称" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email-func">邮箱</Label>
            <Input id="email-func" type="email" placeholder="输入邮箱222" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={close}>
              取消
            </Button>
            <Button onClick={close}>确定</Button>
          </div>
          <div className="text-sm text-gray-500 mt-2">
            <p>✨ 这是函数式调用方式</p>
            <p>• 直接调用 CommonModal() 即可显示</p>
            <p>• 返回 modal 实例，可调用 modal.close() 关闭</p>
            <p>• 适合在事件处理函数中动态创建对话框</p>
          </div>
        </div>
      ),
    });
  };

  return (
    <div className="mt-8 p-6 bg-gray-100 rounded-lg">
      <h3 className="text-xl font-bold mb-4">对话框组件演示</h3>
      <div className="flex gap-4">
        {/* 组件方式 */}
        <Button onClick={() => setComponentModalOpen(true)}>
          打开组件方式对话框
        </Button>

        {/* 函数式调用方式 */}
        <Button onClick={handleFunctionModal} variant="outline">
          打开函数式对话框
        </Button>
      </div>

      {/* 组件方式对话框 - 支持 SSR */}
      <CommonModalComponent
        open={componentModalOpen}
        onOpenChange={setComponentModalOpen}
        title="组件方式对话框"
        type="drawer"
        direction="right"
        width="50%"
      >
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name-comp">名称111</Label>
            <Input id="name-comp" placeholder="输入名称" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email-comp">邮箱</Label>
            <Input id="email-comp" type="email" placeholder="输入邮箱111" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setComponentModalOpen(false)}
            >
              取消
            </Button>
            <Button onClick={() => setComponentModalOpen(false)}>确定</Button>
          </div>
          <div className="text-sm text-gray-500 mt-2">
            <p>🎯 这是组件方式</p>
            <p>• 使用 CommonModalComponent 组件</p>
            <p>• 通过 open 和 onOpenChange props 控制</p>
            <p>• 支持服务端渲染（SSR）</p>
            <p>• 适合在 JSX 中声明式使用</p>
          </div>
        </div>
      </CommonModalComponent>
    </div>
  );
}
