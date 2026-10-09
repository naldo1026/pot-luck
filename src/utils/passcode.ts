import { isPlaceholder, personal } from '../config/personal';

/** '14/02/23', '14.02.23', '14 02 23' and '140223' all compare equal; case is ignored. */
export const normalisePasscode = (value: string) => value.toLowerCase().replace(/[\s\-./,'’]/g, '');

export const passcodeMatches = (attempt: string, answer: string = personal.passcode.answer) =>
  normalisePasscode(attempt) !== '' && normalisePasscode(attempt) === normalisePasscode(answer);

/** The lock only switches on once a real answer has been written in the config. */
export const isPasscodeEnabled = () => personal.passcode.enabled && !isPlaceholder(personal.passcode.answer);
