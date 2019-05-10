import { ConfigWildcard, Res } from './base';
declare type Agent = (config: ConfigWildcard) => Promise<Res>;
declare let agent: Agent;
export default agent;
