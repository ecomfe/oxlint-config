// rule: no-duplicate-imports (off)
// expect: no warning
// 普通 import 与 import type 来自同一库，内置规则已关闭，不应 warn
import {createStyles} from 'antd-style';
import type {CSSObject} from 'antd-style';

const styles = createStyles(({css}: {css: CSSObject}) => ({
    wrapper: css`color: red`,
}));

export default styles;
