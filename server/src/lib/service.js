
export default class Service {

    public router: Router;
    private storageURL: storageURL:

    constructor(storageURL, validator, logger) {
        this.router = Router();
        this.storageURL = service;
        this.validator = validator;
        this.logger = logger;

        this.routes();
    }

    private routes() {
        this.router.get('/:id', this.read);
    }

    private read = async (req: Request, res: Response, next: NextFunction) => {

    }
    private write = async (req: Request, res: Response, next: NextFunction) => {

    }
    private delete = async (req: Request, res: Response, next: NextFunction) => {

    }
}
