import React, { useState } from 'react';
import Tree from 'rc-tree';
import 'rc-tree/assets/index.css';

const MenuBuilder = () => {
  const [treeData, setTreeData] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [nodeName, setNodeName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleAddCategory = () => {
    if (!nodeName) return;

    const newNode = { key: `${Date.now()}`, title: nodeName, children: [] };
    setTreeData([...treeData, newNode]);
    setNodeName('');
  };

  const handleAddSubCategory = () => {
    if (!nodeName) return;
    const newNode = { key: `${Date.now()}`, title: nodeName, children: [] };

    const updatedTreeData = addNodeToParent(treeData, selectedKey, newNode);
    setTreeData(updatedTreeData);
    setNodeName('');
  };

  const addNodeToParent = (nodes, parentKey, newNode) => {
    return nodes.map((node) => {
      if (node.key === parentKey) {
        return { ...node, children: [...(node.children || []), newNode] };
      }
      if (node.children) {
        return { ...node, children: addNodeToParent(node.children, parentKey, newNode) };
      }
      return node;
    });
  };

  const handleEditNode = () => {
    if (!nodeName) return;

    const updatedTreeData = editNodeInTree(treeData, selectedKey, nodeName);
    setTreeData(updatedTreeData);
    setNodeName('');
    setIsEditing(false);
  };

  const editNodeInTree = (nodes, key, newName) => {
    return nodes.map((node) => {
      if (node.key === key) {
        return { ...node, title: newName };
      }
      if (node.children) {
        return { ...node, children: editNodeInTree(node.children, key, newName) };
      }
      return node;
    });
  };

  const handleDeleteNode = () => {
    const updatedTreeData = deleteNodeFromTree(treeData, selectedKey);
    setTreeData(updatedTreeData);
    setSelectedKey(null);
  };

  const deleteNodeFromTree = (nodes, key) => {
    return nodes
      .map((node) => {
        if (node.key === key) return null;
        if (node.children) {
          const filteredChildren = deleteNodeFromTree(node.children, key);
          return { ...node, children: filteredChildren };
        }
        return node;
      })
      .filter(Boolean);
  };

  const onSelect = (selectedKeys) => {
    setSelectedKey(selectedKeys[0] || null);
    setIsEditing(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="container" style={{ maxWidth: '600px' }}>
        <h2 className="text-center mb-4">Menu Builder</h2>

        <div className="input-group mb-3">
          <input
            type="text"
            value={nodeName}
            placeholder="Enter node name"
            onChange={(e) => setNodeName(e.target.value)}
            className="form-control"
          />
          <div className="input-group-append">
            {!selectedKey && (
              <button onClick={handleAddCategory} className="btn btn-primary">
                Add Category
              </button>
            )}

            {selectedKey && !isEditing && (
              <>
                <button onClick={handleAddSubCategory} className="btn btn-success">
                  Add Subcategory
                </button>
                <button onClick={() => setIsEditing(true)} className="btn btn-warning mx-2">
                  Edit Node
                </button>
                <button onClick={handleDeleteNode} className="btn btn-danger">
                  Delete Node
                </button>
              </>
            )}

            {isEditing && (
              <button onClick={handleEditNode} className="btn btn-success">
                Save Edit
              </button>
            )}
          </div>
        </div>

        <div className="card p-3">
          <Tree
            treeData={treeData}
            selectedKeys={[selectedKey]}
            onSelect={onSelect}
            defaultExpandAll
            className="rc-tree"
          />
        </div>
      </div>
    </div>
  );
};

export default MenuBuilder;
