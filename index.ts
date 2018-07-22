import * as Zip from 'jszip'

export class ResourceLocation {
    constructor(
        readonly domain: string,
        readonly path: string) { }
    toString() { return `${this.domain}:${this.path}` }
    /**
     * build from texture path
     */
    static ofTexturePath(path: string) {
        const idx = path.indexOf(':')
        if (idx === -1) return new ResourceLocation('minecraft', `textures/${path}.png`)
        if (idx === 0) return new ResourceLocation('minecraft', `textures/${path.substring(1, path.length)}.png`)
        return new ResourceLocation(path.substring(0, idx), `textures/${path.substring(idx + 1, path.length)}.png`)
    }

    /**
     * build from model path
     */
    static ofModelPath(path: string) {
        const idx = path.indexOf(':')
        if (idx === -1) return new ResourceLocation('minecraft', `models/${path}.json`)
        if (idx === 0) return new ResourceLocation('minecraft', `models/${path.substring(1, path.length)}.json`)
        return new ResourceLocation(path.substring(0, idx), `models/${path.substring(idx + 1, path.length)}.json`)
    }

    /**
     * from absoluted path
     */
    static fromPath(path: string) {
        const idx = path.indexOf(':')
        if (idx === -1) return new ResourceLocation('minecraft', path)
        if (idx === 0) return new ResourceLocation('minecraft', path.substring(1, path.length))
        return new ResourceLocation(path.substring(0, idx), path.substring(idx + 1, path.length))
    }
}

export interface PackInfo {
    readonly name: string
    readonly description: string
    readonly format: number
    readonly icon?: string
}

export interface Resource {
    /**
     * the absolute location of the resource
     */
    location: ResourceLocation
    data: string
    metadata?: { [section: string]: any }
}

export interface ResourceSource {
    load(location: ResourceLocation, type?: 'base64' | 'text'): Promise<Resource | void>
    has(location: ResourceLocation): Promise<boolean>
    update(location: ResourceLocation, data: string, type?: 'base64' | 'text'): Promise<void>
    domains(): Promise<string[]>
    info(): Promise<PackInfo>
    readonly type: string
}

const ATOZ = /[a-z]/
export class ResourceSourceZip implements ResourceSource {
    update(location: ResourceLocation, data: string, type: 'base64' | 'text' = 'text'): Promise<void> {
        const path = `assets/${location.domain}/${location.path}`
        this.zip.file(path, data, { base64: type === 'base64' })
        return Promise.resolve()
    }
    has(location: ResourceLocation): Promise<boolean> {
        const path = `assets/${location.domain}/${location.path}`
        const file = this.zip.file(path)
        if (!file) return Promise.resolve(true)
        return Promise.resolve(false)
    }
    type = 'zip'
    constructor(readonly name: string, private zip: Zip) { }
    async load(location: ResourceLocation, type: 'base64' | 'text' = 'text') {
        const path = `assets/${location.domain}/${location.path}`
        const file = this.zip.file(path)
        if (!file) return Promise.resolve()

        const metaPath = `${path}.mcmeta`
        const metaFile = this.zip.file(metaPath)
        return {
            data: await file.async(type),
            metadata: metaFile ? JSON.parse(await metaFile.async('text')) : undefined,
            location,
        }
    }
    async info(): Promise<PackInfo> {
        const iconPath = this.zip.file('pack.png')
        const metaPath = this.zip.file('pack.mcmeta')
        const info: any = {
            name: this.name,
            description: '',
            format: -1,
            icon: undefined
        }
        if (iconPath) info.icon = await iconPath.async('base64')
        if (metaPath) {
            const { description, pack_format } = JSON.parse(await metaPath.async('text')).pack
            info.description = description
            info.format = pack_format
        }
        return info
    }
    domains(): Promise<string[]> {
        const set: { [domain: string]: boolean } = {}
        Object.keys(this.zip.files)
            .filter(file => file.startsWith('assets') && file.length > 7 && file[7].match(ATOZ))
            .map(file => file.substring(7, file.indexOf('/', 7)))
            .forEach(file => { set[file] = true })
        return Promise.resolve(Object.keys(set))
    }
}

interface ResourceSourceWrapper {
    source: ResourceSource
    info: PackInfo
    domains: string[]
}

export class ResourceManager {
    private cache: { [location: string]: Resource | undefined } = {}

    constructor(private list: ResourceSourceWrapper[] = []) { }

    private putCache(res: Resource) {
        this.cache[res.location.toString()] = res
        return res
    }

    async addResourceSource(source: ResourceSource) {
        const info = await source.info()
        const domains = await source.domains()
        const wrapper = { info, source, domains }

        this.list.push(wrapper)
    }

    clearCache() { this.cache = {} }
    clearAll() {
        this.cache = {}
        this.list.splice(0, this.list.length)
    }

    get allPacks() { return this.list.map(l => l.info) }

    swap(first: number, second: number) {
        if (first >= this.list.length || first < 0 || second >= this.list.length || second < 0) {
            throw new Error('Illegal index')
        }

        const fir = this.list[first]
        this.list[first] = this.list[second]
        this.list[second] = fir

        this.clearCache()
    }

    invalidate(location: ResourceLocation) {
        delete this.cache[location.toString()]
    }

    async load(location: ResourceLocation, encoding: 'base64' | 'text' = 'text'): Promise<Resource | undefined> {
        const cached = this.cache[location.toString()]
        if (cached) return cached

        for (const src of this.list) {
            const loaded = await src.source.load(location, encoding)
            if (!loaded) continue
            return this.putCache(loaded)
        }

        return undefined
    }
}
