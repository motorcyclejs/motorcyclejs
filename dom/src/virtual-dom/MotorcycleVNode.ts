import { VNode, VNodeData } from '../types';

export class MotorcycleVNode implements VNode {
  constructor(
    public tagName: string | undefined,
    public className: string | undefined,
    public id: string | undefined,
    public data: VNodeData | undefined,
    public children: Array<VNode> | undefined,
    public text: string | undefined,
    public elm: Node | undefined,
    public key: string | number | undefined) {
  }

  public static createTextVNode(text: string) {
    return new MotorcycleVNode(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      text,
      undefined,
      undefined,
    );
  }
}
