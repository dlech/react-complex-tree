import { ExplicitDataSource, TreeChangeHandlers } from '../types';
import { useCallback, useEffect } from 'react';

// events that should trigger a recalculation of the linear items
const updateEvents: Array<keyof TreeChangeHandlers> = [
  'onCollapseItem',
  'onExpandItem',
  'onRegisterTree',
  'onUnregisterTree',
];

export const useUpdateLinearItems = (
  update: () => void,
  changeHandlers: TreeChangeHandlers,
  items: ExplicitDataSource['items']
) => {
  useEffect(update, [update, items]);
  const newChangeHandlers: Partial<TreeChangeHandlers> = {};

  for (const event of updateEvents) {
    // run hook in loop, since the looping array is fixed the hooks will be called consistently
    // eslint-disable-next-line react-hooks/rules-of-hooks
    newChangeHandlers[event] = useCallback<any>(
      (...args: any[]) => {
        update();
        (changeHandlers[event] as any)(...args);
      },
      [changeHandlers, event, update]
    );
  }

  return newChangeHandlers;
};
