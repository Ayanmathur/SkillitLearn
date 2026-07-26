const { getPathBySlug } = require('../src/lib/dal');

async function testPathRender() {
  console.log("Testing getPathBySlug('data-analytics')...");
  try {
    const path = await getPathBySlug('data-analytics');
    console.log("Result:", JSON.stringify(path, null, 2));
  } catch (err) {
    console.error("EXCEPTIONAL ERROR:", err);
  }
}

testPathRender();
