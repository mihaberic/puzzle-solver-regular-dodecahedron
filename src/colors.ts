/**
 * Enum off all 12 available colors. The values are hex color strings.
 * Note: some of these color namings might be subjective, but this is how I see them.
 */
export enum Color {
    DarkBlue = '#2a3bab',
    LightBlue = '#00ffdd',
    Emerald = '#64e8b8',

    DarkGreen = '#1c621c',
    LightGreen = '#00ff00',
    Red = '#ff0000',

    DarkYellow = '#d8a20e', // Gold. But then green can't use "G" for code
    LightYellow = '#eff30f',
    Violet = '#621564',

    White = '#ffffff',
    DarkPink = '#ff88a3',
    LightPink = '#ffd0ed',
}

export const COLORS = Object.values(Color)

const colorAndCodePairs: [Color, string][] = [
    [Color.DarkBlue, 'B'],
    [Color.LightBlue, 'b'],
    [Color.Emerald, 'E'],

    [Color.DarkGreen, 'G'],
    [Color.LightGreen, 'g'],
    [Color.Red, 'R'],

    [Color.DarkYellow, 'Y'],
    [Color.LightYellow, 'y'],
    [Color.Violet, 'V'],

    [Color.White, 'W'],
    [Color.DarkPink, 'P'],
    [Color.LightPink, 'p'],
]

export const colorToCodeMap = new Map(colorAndCodePairs)
export const codeToColorMap = new Map(colorAndCodePairs.map(([a, b]) => [b, a]))
