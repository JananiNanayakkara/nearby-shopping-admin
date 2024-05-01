import { ReloadIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';

export function ButtonLoading({
	variant,
}: {
	variant?:
		| 'default'
		| 'destructive'
		| 'outline'
		| 'secondary'
		| 'ghost'
		| 'link'
		| null
		| undefined;
}) {
	return (
		<Button disabled variant={variant ?? 'default'}>
			<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
			Please wait
		</Button>
	);
}
