export interface IPresenter<T> {
    present(value:T): void;
}