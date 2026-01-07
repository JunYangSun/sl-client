import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  color: string;
  content?: React.ReactNode;
  onClick?: () => void;
}

interface MenuListProps {
  items: MenuItem[];
}

export default function MenuList({ items }: MenuListProps) {
  return (
    <div className="px-4">
      <Card className="rounded-xl overflow-hidden p-[16px]">
        <Accordion type="single" collapsible className="w-full">
          {items.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-gray-100 border-b-0"
              >
                <AccordionTrigger className="px-0 hover:no-underline  [&[data-state=open]_svg:last-child]:rotate-180">
                  <div className="flex items-center gap-3 flex-1">
                    <IconComponent className={`h-5 w-5 ${item.color} shrink-0`} />
                    <span className="text-sm text-gray-900">{item.label}</span>
                  </div>
                </AccordionTrigger>
                {item.content ? (
                  <AccordionContent className="p-[16px] pt-4">
                    {item.content}
                  </AccordionContent>
                ) : item.onClick ? (
                  <AccordionContent className="px-0 pb-0 pt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        item.onClick?.();
                      }}
                      className="w-full text-left text-sm text-gray-600 hover:text-gray-900"
                    >
                      点击查看详情
                    </button>
                  </AccordionContent>
                ) : null}
              </AccordionItem>
            );
          })}
        </Accordion>
      </Card>
    </div>
  );
}
