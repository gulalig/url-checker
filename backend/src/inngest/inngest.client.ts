import { Inngest } from 'inngest';
import { INNGEST_CLIENT } from './constants/inngest.constants';

export const inngest = new Inngest({
  id: INNGEST_CLIENT.ID,
});
