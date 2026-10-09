import { shareText } from '../utils/share';
import { ShareIcon } from './icons';
import { useToast } from './Toast';

export function ShareButton({ text }: { text: string }) {
  const toast = useToast();
  return (
    <button
      type="button"
      className="btn btn-primary"
      onClick={async () => {
        const result = await shareText(text);
        if (result === 'copied') toast('Copied — send it over!');
        if (result === 'failed') toast("Couldn't copy, sorry!");
      }}
    >
      Share <ShareIcon width={18} height={18} />
    </button>
  );
}
