import { QdrantClient } from "@qdrant/js-client-rest";

let qdrantClient: QdrantClient;

/**
 * Initializes the Qdrant client running locally
 */
function init() {
  qdrantClient = new QdrantClient({ host: "localhost", port: 6333 });
}

function getClient(): QdrantClient {
  if (!qdrantClient) {
    init();
  }
  return qdrantClient;
}

/**
 * Creates a collection with the specified ID
 * @param id - The ID of the collection
 */
function createCollection(id: number) {
  qdrantClient.createCollection(`${id}`, {
    vectors: {
      size: 384,
      distance: "Cosine"
    },
    optimizers_config: {
      memmap_threshold: 20000
    },
    hnsw_config: {
      on_disk: true
    }
  });
}

/**
 * Inserts data into the Qdrant client.
 *
 * @param id - The ID of the data.
 * @param data - The data to be inserted.
 */
function insertData(id: number, vector: number[], payload: Record<string, unknown> | null) {
  qdrantClient.upsert(`${id}`, {
    wait: true,
    points: [
      {
        id: id,
        vector: vector,
        payload: payload
      }
    ]
  });
}

/**
 * Searches a collection in Qdrant based on the provided parameters
 * @param id - The ID of the collection to search
 * @param vector - The vector to search for
 * @param limit - The maximum number of results to return
 * @returns A promise that resolves to the search result
 */
async function searchCollection(id: number, vector: number[], limit: number) {
  let searchResult = await qdrantClient.search(`${id}`, {
    vector: vector,
    limit: limit,
    with_payload: true
  });

  return searchResult;
}

/**
 * Deletes a collection with the specified ID
 * @param id - The ID of the collection to delete
 */
function deleteCollection(id: number): Promise<boolean> {
  return qdrantClient.deleteCollection(`${id}`);
}

export default {
  init,
  createCollection,
  insertData,
  searchCollection,
  deleteCollection
};