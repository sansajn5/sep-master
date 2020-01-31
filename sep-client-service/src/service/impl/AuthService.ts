import { injectable, inject } from "inversify";
import { compareSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { IAuthService } from "..";
import { IClientRepository } from "../../database";
import { Constants } from "../../util";
import { ICacheClientService } from "../../cache";

@injectable()
class AuthService implements IAuthService {
    
    _clientRepository: IClientRepository;

    _cacheService: ICacheClientService;

    readonly CACHE_PREFIX = 'SESSION_';

    constructor(@inject(Constants.IClientRepository) clientRepository: IClientRepository, @inject(Constants.ICacheClientService) cacheService: ICacheClientService) {
        this._clientRepository = clientRepository;
        this._cacheService = cacheService;
    }

    public async login(merchantId: string, password: string): Promise<any> {
        const client = await this._clientRepository.getRepo().findOne({ where: { merchantId: merchantId } });
        
        if (!client) {
            throw new Error("MerchantId Does not exist.");
        }
        const isValidPassword = compareSync(password, client.secret);
        if (!isValidPassword) {
            throw new Error("Method not implemented.");
        }

        const token = jwt.sign({merchantId}, process.env.JWT_SECRET, {
            expiresIn: parseInt(process.env.JWT_EXPIRE)
        });

        this._cacheService.setValue(`${this.CACHE_PREFIX}${token}`, JSON.stringify(client), 3500);

        return Promise.resolve({token});
    }
}

export default AuthService;