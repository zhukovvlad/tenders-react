export const parseGoMapString = (str: string): any => {
    if (typeof str !== 'string') return str;

    const fromGo = (s: string): any => {
        s = s.trim();
        if (s.startsWith('map[')) {
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
                    const key = part.substring(0, colonIndex);
                    const value = part.substring(colonIndex + 1);
                    result[key] = fromGo(value);
                    lastSplit = i + 1;
                }
            }
            const part = content.substring(lastSplit);
            const colonIndex = part.indexOf(':');
            const key = part.substring(0, colonIndex);
            const value = part.substring(colonIndex + 1);
            if (key) {
                result[key] = fromGo(value);
            }

            return result;
        }
        if (s.startsWith('[') && s.endsWith(']')) {
            const content = s.substring(1, s.length - 1).trim();
            if (content === '') return [];
            return content.split(' ').filter(Boolean);
        }
        if (s === '<nil>') return null;
        if (s === 'true') return true;
        if (s === 'false') return false;
        return s;
    }
    
    const cleanedStr = str.replace(/\\u003c/g, '<').replace(/\\u003e/g, '>');
    return fromGo(cleanedStr);
}
