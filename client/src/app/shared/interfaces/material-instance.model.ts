export interface MaterialInstance {
  open?(): void;
  close?(): void;
  destroy?(): void;
}
