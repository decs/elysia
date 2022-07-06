import type { Handler, HandlerObject } from './types'

export default class HandlerStorage {
    handlers: HandlerObject[]
    unconstrainedHandler: HandlerObject | null

    constructor() {
        this.handlers = []
        this.unconstrainedHandler = null
    }

    addHandler(handler: Handler, params: string[], store: any) {
        const handlerObject: HandlerObject = {
            handler,
            params,
            _createParamsObject: this._compileCreateParamsObject(params),
            store: store || null
        }

        this.unconstrainedHandler = handlerObject

        if (this.handlers.length >= 32)
            throw new Error(
                'find-my-world supports a maximum of 32 route handlers per node when there are constraints, limit reached'
            )

        this.handlers.push(handlerObject)
    }

    _compileCreateParamsObject(params: string[]) {
        const lines: string[] = []

        for (let i = 0; i < params.length; i++)
            lines.push(`'${params[i]}': paramsArray[${i}]`)

        const fn = new Function(
            'paramsArray',
            `return {${lines.join(',')}}`
        ) as (params: string[]) => Record<string, string | undefined>

        return fn
    }
}