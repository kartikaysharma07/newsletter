import React, { memo } from 'react';

const DataTable = memo(({ type, data, onEdit, onDelete }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {data?.map((item) => (
      <div key={item.id || item.key} className="p-4 bg-neutral-800/50 border border-neutral-700 rounded">
        <h3 className="text-xl font-bold">{item.title || item.key}</h3>
        {type === 'blogs' && <p className="text-neutral-300">{item.subtitle}</p>}
        {type === 'posts' && (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-400">
            {item.url}
          </a>
        )}
        {type === 'metadata' && <pre className="text-neutral-300">{JSON.stringify(item.value, null, 2)}</pre>}
        {(item.image_url || item.image) && <img src={item.image_url || item.image} alt={item.title || item.key} className="w-full h-32 object-cover my-2 rounded" />}
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(item)}
            className="p-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(type === 'metadata' ? 'website_metadata' : type, item.id || item.key)}
            className="p-2 bg-red-600 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
));

export default DataTable;