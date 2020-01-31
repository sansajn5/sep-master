import { IWebhookListener } from "..";
import { injectable } from "inversify";

@injectable()
class WebhookListener implements IWebhookListener {
    listenWebhooks(): Promise<any> {
        throw new Error("Method not implemented.");
    }

}

export default WebhookListener;