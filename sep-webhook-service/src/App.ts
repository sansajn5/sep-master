import { injectable, inject } from "inversify";

import { IClientCreatedListener } from "./service";
import { Constants } from "./util";

export interface IApp {
    listenClientCreated(): Promise<void>;
}

@injectable()
export class App implements IApp {
    _listenerService: IClientCreatedListener;

    constructor(@inject(Constants.IClientCreatedListener) listnerService: IClientCreatedListener) {
        this._listenerService = listnerService;
    }

    listenClientCreated(): Promise<void> {
        return this._listenerService.listen();
    }
}