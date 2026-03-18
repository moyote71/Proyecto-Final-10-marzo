import { vi, beforeAll, afterEach } from 'vitest';

const createModelMock = () => {
    const model = vi.fn().mockImplementation(function() {
        return {
            save: vi.fn().mockResolvedValue(true),
            populate: vi.fn().mockReturnThis(),
        };
    });

    // Métodos que suelen encadenarse - ahora devuelven un objeto "query"
    const mockQuery = {
        populate: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue(null),
        then: function (resolve, reject) {
            return this.exec().then(resolve, reject);
        }
    };

    model.findOne = vi.fn().mockReturnValue(mockQuery);
    model.find = vi.fn().mockReturnValue(mockQuery);
    model.findById = vi.fn().mockReturnValue(mockQuery);
    model.findByIdAndUpdate = vi.fn().mockReturnValue(mockQuery);
    model.findByIdAndDelete = vi.fn().mockReturnValue(mockQuery);
    model.countDocuments = vi.fn().mockResolvedValue(0);
    model.create = vi.fn().mockResolvedValue({});

    return model;
};

vi.mock('../models/user.js', () => ({ default: createModelMock() }));
vi.mock('../models/product.js', () => ({ default: createModelMock() }));
vi.mock('../models/order.js', () => ({ default: createModelMock() }));
vi.mock('../models/cart.js', () => ({ default: createModelMock() }));

beforeAll(async () => { });

afterEach(() => {
    vi.clearAllMocks();
});
