interface Props {
    formula: string;
    name?: string;
    desc?: string;
    type?: 'formula' | 'reaction' | 'equilibrium' | 'ionic';
    class?: string;
}
declare const ChemNotation: import("svelte").Component<Props, {}, "">;
type ChemNotation = ReturnType<typeof ChemNotation>;
export default ChemNotation;
