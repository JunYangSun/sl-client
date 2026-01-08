import type { PageResponse } from "@/lib/request/types";

/**
 * 查询参数类型
 */
export interface QueryParams {
  /** 当前页码 */
  pageNum?: number;
  /** 每页数量 */
  pageSize?: number;
  /** 搜索关键词 */
  keyword?: string;
  /** 其他自定义查询参数 */
  [key: string]: string | number | boolean | undefined;
}


/**
 * EcomList 相关类型
 */
export interface EcomListBaseRenderPayload<T> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
  loading: boolean;
  hasMore: boolean;
}

export interface EcomListServerProps<T> {
  /** 服务端已经拿到的数据列表（SSR 首屏） */
  data: T[];
  /** 总条数 */
  total: number;
  /** 当前页码（可选，默认 1） */
  pageNum?: number;
  /** 每页数量（可选，默认 10） */
  pageSize?: number;
  /** PC 端是否显示分页（默认 true，不传参数正常展示，不想显示时传 false） */
  showPagination?: boolean;
  /** 是否启用移动端无限滚动追加（默认 true，不传参数正常展示，不想启用时传 false） */
  infiniteAppendOnMobile?: boolean;
  /** 渲染组件：Client Component，接收 payload 作为 props */
  View: React.ComponentType<EcomListBaseRenderPayload<T>>;
}

export interface EcomListClientProps<T> {
  /**
   * 接口函数（方法组件的"接口"），可选。
   * 若未提供，则需提供 url，由组件内部使用通用 get 封装自动请求。
   */
  request?: (params: QueryParams) => Promise<PageResponse<T>>;
  /**
   * 接口地址（如 "/admin/account/page/list"）。
   * 当未显式提供 request 时，将使用 url + get 自动请求并做分页结构适配。
   */
  url?: string;
  /**
   * 初始查询参数 / 外部控制参数（可以包含多个字段）
   * 等价于 data，仅名称不同，二者会合并。
   */
  params?: QueryParams;
  /**
   * 查询参数别名，等价于 params。便于理解为"data 请求参数"。
   */
  data?: QueryParams;
  /** PC 端是否显示分页（默认 true，不传参数正常展示，不想显示时传 false） */
  showPagination?: boolean;
  /** 每页数量（可选，默认 10） */
  pageSize?: number;
  /** 是否启用移动端无限滚动追加（默认 true，不传参数正常展示，不想启用时传 false） */
  infiniteAppendOnMobile?: boolean;
  /** 数据变化回调（可选） */
  onDataChange?: (
    payload: EcomListBaseRenderPayload<T> & {
      raw?: Partial<PageResponse<T>>;
    }
  ) => void;
  /** 渲染组件：Client Component，接收 payload 作为 props */
  View: React.ComponentType<EcomListBaseRenderPayload<T>>;
}

export type EcomListProps<T> = EcomListServerProps<T> | EcomListClientProps<T>;

