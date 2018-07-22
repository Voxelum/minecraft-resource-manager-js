import * as Zip from 'jszip';
export declare class ResourceLocation {
    readonly domain: string;
    readonly path: string;
    constructor(domain: string, path: string);
    toString(): string;
    /**
     * build from texture path
     */
    static ofTexturePath(path: string): ResourceLocation;
    /**
     * build from model path
     */
    static ofModelPath(path: string): ResourceLocation;
    /**
     * from absoluted path
     */
    static fromPath(path: string): ResourceLocation;
}
export interface PackInfo {
    readonly name: string;
    readonly description: string;
    readonly format: number;
    readonly icon?: string;
}
export interface Resource {
    /**
     * the absolute location of the resource
     */
    location: ResourceLocation;
    data: string;
    metadata?: {
        [section: string]: any;
    };
}
export interface ResourceSource {
    load(location: ResourceLocation, type?: 'base64' | 'text'): Promise<Resource | void>;
    has(location: ResourceLocation): Promise<boolean>;
    update(location: ResourceLocation, data: string, type?: 'base64' | 'text'): Promise<void>;
    domains(): Promise<string[]>;
    info(): Promise<PackInfo>;
    readonly type: string;
}
export declare class ResourceSourceZip implements ResourceSource {
    readonly name: string;
    private zip;
    update(location: ResourceLocation, data: string, type?: 'base64' | 'text'): Promise<void>;
    has(location: ResourceLocation): Promise<boolean>;
    type: string;
    constructor(name: string, zip: Zip);
    load(location: ResourceLocation, type?: 'base64' | 'text'): Promise<void | {
        data: string;
        metadata: any;
        location: ResourceLocation;
    }>;
    info(): Promise<PackInfo>;
    domains(): Promise<string[]>;
}
interface ResourceSourceWrapper {
    source: ResourceSource;
    info: PackInfo;
    domains: string[];
}
export declare class ResourceManager {
    private list;
    private cache;
    constructor(list?: ResourceSourceWrapper[]);
    private putCache;
    addResourceSource(source: ResourceSource): Promise<void>;
    clearCache(): void;
    clearAll(): void;
    readonly allPacks: PackInfo[];
    swap(first: number, second: number): void;
    invalidate(location: ResourceLocation): void;
    load(location: ResourceLocation, encoding?: 'base64' | 'text'): Promise<Resource | undefined>;
}
export {};
