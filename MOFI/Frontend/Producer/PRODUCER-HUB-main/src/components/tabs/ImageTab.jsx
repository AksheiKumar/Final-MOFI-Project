function ImageTab({ images, movie, onDelete, onShowModal }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Images Gallery</h2>
        <button
          onClick={() => onShowModal(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Image</span>
        </button>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image) => (
            <div key={image.id} className="group relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-amber-500 transition-all shadow-lg hover:shadow-2xl hover:shadow-amber-500/20">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold truncate">{image.title}</h3>
              </div>
              <button
                onClick={() => onDelete(image.id)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-zinc-800/50 to-black/50 rounded-2xl border border-zinc-700/50">
          <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-full p-8 mb-6">
            <svg className="w-16 h-16 text-amber-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-zinc-300 text-xl mb-2">No images yet</p>
          <p className="text-zinc-500 text-sm">Add your first image</p>
        </div>
      )}
    </div>
  );
}

export default ImageTab;
