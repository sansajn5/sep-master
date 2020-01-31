import { injectable, inject } from "inversify";
import { ILogCreatedListener } from "./service";
import { Constants } from "./util";

export interface IApp {
    listenLogCreated(): Promise<void>;
}

@injectable()
export class App implements IApp {
    _listenerService: ILogCreatedListener;

    constructor(@inject(Constants.ILogCreatedListner) listnerService: ILogCreatedListener) {
        this._listenerService = listnerService;
    }

    listenLogCreated(): Promise<void> {
        return this._listenerService.listen();
    }
}