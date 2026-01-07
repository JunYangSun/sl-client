"use client";

import { Button } from "@/components/ui/button";
import { post } from "@/lib/request/client";
import { toast } from "@/lib/utils/toast";
import { useState } from "react";

export function CreateRoleButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await toast.promise(
        post<unknown>("system/role", {
          status: "0",
          roleName: "test007",
          roleKey: "test007",
          roleSort: 7,
          remark: "beizhu ",
          deptIds: [],
          menuIds: [],
          dataScope: "",
          deptCheckStrictly: false,
          menuCheckStrictly: false,
        }, {
          showErrorToast: false, // toast.promise 会处理错误显示
        }),
        {
          loading: "创建中...",
          success: "创建角色成功！",
          error: (err) => err.message || "创建角色失败",
        }
      );
    } catch (error) {
      console.error("创建角色失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={isLoading} className="cursor-pointer">
      {isLoading ? "创建中..." : "创建新代理"}
    </Button>
  );
}
