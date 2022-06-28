import type { TreeLeaf } from '../core/tree'

export function generateRouteRecord(
  node: TreeLeaf,
  indent = 0,
  parent: TreeLeaf | null = null
): string {
  // root
  if (node.value.path === '/' && indent === 0) {
    return `[
${node
  .getSortedChildren()
  .map((child) => generateRouteRecord(child, indent + 1))
  .join(',\n')}
]`
  }

  const startIndent = ' '.repeat(indent * 2)
  const indentStr = ' '.repeat((indent + 1) * 2)

  const name = node.options.getRouteName(node)

  return `${startIndent}{
${indentStr}path: '${(parent ? '' : '/') + node.value.pathSegment}',
${indentStr}${node.value.filePaths.size ? `name: '${name}',` : '/* no name */'}
${indentStr}${
    node.value.filePaths.size
      ? generateRouteRecordComponent(node, indentStr)
      : '/* no component */'
  }
${indentStr}${
    node.children.size > 0
      ? `children: [
${node
  .getSortedChildren()
  .map((child) => generateRouteRecord(child, indent + 2, node))
  .join(',\n')}
${indentStr}],`
      : '/* no children */'
  }
${startIndent}}`
}

function generateRouteRecordComponent(
  node: TreeLeaf,
  indentStr: string
): string {
  const files = Array.from(node.value.filePaths)
  return files.length === 1
    ? `component: () => import('${files[0][1]}'),`
    : // files has at least one entry
      `components: {
${files
  .map(([key, path]) => `${indentStr + '  '}'${key}': () => import('${path}')`)
  .join(',\n')}
${indentStr}},`
}
