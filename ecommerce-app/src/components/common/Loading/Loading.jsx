import { loadingStyles as S } from "./LoadingStyles";

export default function Loading({ children }) {
    return (
        <div className={S.container()}>
            <div className={S.spinner()} aria-label="Cargando" />
            <span className={S.text()}>{children}</span>
        </div>
    );
}
