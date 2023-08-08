import PocketBase from 'pocketbase';
import { pocketbase_url } from './const.js';
const pb = new PocketBase(pocketbase_url);
pb.autoCancellation(false)
    ;
export default pb;
