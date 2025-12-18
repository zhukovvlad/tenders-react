/**
 * Parses a string representation of a Go map into a JavaScript object.
 * This parser is specifically designed to handle the nested map and array-like
 * structures present in the AI analysis output for tender key parameters.
 *
 * Example input:
 * "map[category:Нулевой цикл data:map[main_pile_specs:map[...]]]"
 *
 * **Limitations:**
 * - Assumes space-delimited key-value pairs
 * - Does not support escaped spaces, colons, or brackets within string values
 * - Does not support quoted strings
 * - Values containing spaces must be enclosed in nested structures (maps/arrays)
 * - Example that would fail: `map[name:John Doe age:30]` (space in value)
 *
 * @param str The string to parse.
 * @returns A nested JavaScript object, array, primitive value, or the original input.
 *   - Objects are returned as Record<string, any>
 *   - Arrays are returned as any[]
 *   - Primitives: null, boolean, or string
 *   - Malformed input is returned as-is with a console warning
 */
export const parseGoMapString = (str: string): Record<string, any> | any[] | string | boolean | null => {
    if (typeof str !== 'string') return str;

    const fromGo = (s: string): any => {
        s = s.trim();
        if (s.startsWith('map[')) {
            if (!s.endsWith(']')) {
                console.warn('Malformed map string, missing closing bracket:', s);
                return s; // Return as-is for malformed input
            }
            const result: { [key: string]: any } = {};
            const content = s.substring(4, s.length - 1);
            
            let balance = 0;
            let lastSplit = 0;
            for(let i = 0; i < content.length; i++) {
                if (content[i] === '[') balance++;
                else if (content[i] === ']') balance--;
                else if (content[i] === ' ' && balance === 0) {
                    const part = content.substring(lastSplit, i);
                    const colonIndex = part.indexOf(':');
                    if (colonIndex === -1) {
                        lastSplit = i + 1;
                        continue;
                    }
                    const key = part.substring(0, colonIndex);
                    const value = part.substring(colonIndex + 1);
                    result[key] = fromGo(value);
                    lastSplit = i + 1;
                }
            }
            const part = content.substring(lastSplit);
            const colonIndex = part.indexOf(':');
            if (colonIndex !== -1) {
                const key = part.substring(0, colonIndex);
                const value = part.substring(colonIndex + 1);
                if (key) {
                    result[key] = fromGo(value);
                }
            }

            return result;
        }
        if (s.startsWith('[') && s.endsWith(']')) {
            const content = s.substring(1, s.length - 1).trim();
            if (content === '') return [];
            
            // Handle nested structures in arrays
            const items: any[] = [];
            let balance = 0;
            let lastSplit = 0;
            
            for (let i = 0; i < content.length; i++) {
                if (content[i] === '[') balance++;
                else if (content[i] === ']') balance--;
                else if (content[i] === ' ' && balance === 0) {
                    const item = content.substring(lastSplit, i).trim();
                    if (item) items.push(fromGo(item));
                    lastSplit = i + 1;
                }
            }
            
            const lastItem = content.substring(lastSplit).trim();
            if (lastItem) items.push(fromGo(lastItem));
            
            // Return parsed items, or empty array if none found
            return items;
        }
        if (s === '<nil>') return null;
        if (s === 'true') return true;
        if (s === 'false') return false;
        return s;
    }
    
    const cleanedStr = str.replace(/\\u003c/g, '<').replace(/\\u003e/g, '>');
    return fromGo(cleanedStr);
}
