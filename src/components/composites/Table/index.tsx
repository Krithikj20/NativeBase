import { HStack } from '../../primitives/Stack';
import React from 'react';
import Box, { IBoxProps } from '../../primitives/Box';
import type { IHStackProps } from '../../primitives/Stack/HStack';
import { FlatList, FlatListProps } from 'react-native';

type ITemplateProps = number[] | { [key: number]: any };

interface ITableProps extends IBoxProps {
  templateColumns?: ITemplateProps;
  _column?: IBoxProps;
  children?: any | (({ item }: any) => any);
  ListHeaderComponent: Pick<FlatListProps<any>, 'ListHeaderComponent'>;
  data: any[];
}

const TableContext = React.createContext({
  templateColumns: {} as ITemplateProps,
  _column: {} as IBoxProps,
});

export const Table = React.forwardRef(
  (
    {
      templateColumns = {},
      _column = {},
      data,
      ListHeaderComponent,
      ...rest
    }: ITableProps,
    ref: any
  ) => {
    return (
      <TableContext.Provider value={{ templateColumns, _column }}>
        {data ? (
          <VirtualizedTable
            data={data}
            ListHeaderComponent={ListHeaderComponent}
            renderItem={rest.children}
          />
        ) : (
          <Box width="100%" ref={ref} {...rest} />
        )}
      </TableContext.Provider>
    );
  }
);

const VirtualizedTable = ({ data, renderItem, ListHeaderComponent }: any) => {
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      ListHeaderComponent={ListHeaderComponent}
      // keyExtractor={({ item }) => item.id}
    />
  );
};

interface ITdProps extends IBoxProps {
  flex?: number;
  children?: any;
}

export const Td = React.forwardRef((props: ITdProps, ref: any) => {
  return <Box flex={1} ref={ref} {...props}></Box>;
});

interface ITrProps extends IHStackProps {
  children?: any;
}

export const Tr = React.forwardRef(
  ({ children, ...props }: ITrProps, ref: any) => {
    const { templateColumns, _column } = React.useContext(TableContext);

    const newChildren = React.Children.map(children, (child, idx) => {
      const columnProps =
        typeof templateColumns[idx] === 'number'
          ? { flex: templateColumns[idx] }
          : templateColumns[idx];

      return React.cloneElement(child, {
        ..._column,
        ...columnProps,
      });
    });

    return (
      <HStack ref={ref} {...props}>
        {newChildren}
      </HStack>
    );
  }
);
