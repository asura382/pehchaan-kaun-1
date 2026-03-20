const novelService = require("./services/novelService");
const arcService = require("./services/arcService");
const chapterService = require("./services/chapterService");
const logger = require("./utils/logger");

async function generate() {
  try {
    // 1️⃣ Create novel with all required fields
    const novel = await novelService.createNovel({
      title: "Test Novel",
      theme: "A low-ranked student faces public humiliation and begins their rise to power",
      genre: "Fantasy Academy",
      tone: "Dark and intense with moments of triumph",
      worldRules: "Magic exists but is strictly controlled by the academy hierarchy",
      mainCharacter: "Alex, a 17-year-old student from a poor family",
      sideCharacters: ["Professor Drake - Strict academy instructor", "Maya - Fellow student and rival"],
      totalChapters: 20
    });

    console.log("Novel created:", novel.id);
    logger.info(`Novel created: ${novel.id} - ${novel.title}`);

    // 2️⃣ Generate arcs manually since we're not using the API endpoint
    console.log("Generating arcs...");
    let arcs = [];
    try {
      arcs = await arcService.generateArcs(novel);
      console.log("Arcs generated:", arcs.length);
      if (arcs.length > 0) {
        console.log("First arc:", arcs[0].arcTitle);
      }
    } catch (arcError) {
      console.log("Arc generation failed (Ollama not running):", arcError.message);
      console.log("Creating mock arcs for testing...");
      // Create mock arcs for testing when Ollama is not available
      arcs = [
        {
          arcTitle: "Academy Entrance Arc",
          arcGoal: "Establish protagonist's low status and initial humiliation",
          arcConflict: "Public evaluation where protagonist fails spectacularly",
          emotionalShift: "Shame to determination",
          startChapter: 1,
          endChapter: 5,
          currentChapter: 1,
          completed: false
        }
      ];
      // Save mock arcs
      await arcService.saveArcs(novel.id, arcs);
      console.log("Mock arcs created:", arcs.length);
    }

    // 3️⃣ Generate first chapter
    console.log("\nGenerating Chapter 1...");
    let chapterResult;
    try {
      chapterResult = await chapterService.generateChapter(novel.id, 1);
      
      console.log("\n=== CHAPTER GENERATION RESULT ===");
      console.log("Success:", chapterResult.success);
      console.log("Message:", chapterResult.message);
      console.log("Chapter Number:", chapterResult.data.chapterNumber);
      console.log("Arc Name:", chapterResult.data.arcName);
      console.log("Word Count:", chapterResult.data.wordCount);
      
      // 4️⃣ Retrieve and display the generated chapter
      const chapter = await chapterService.getChapter(novel.id, 1);
      if (chapter) {
        console.log("\n=== GENERATED CHAPTER CONTENT ===\n");
        console.log(chapter.content);
      }
    } catch (chapterError) {
      console.log("Chapter generation failed (Ollama not running):", chapterError.message);
      console.log("\n=== MOCK CHAPTER CONTENT ===");
      console.log("This is a mock chapter generated for testing purposes.");
      console.log("In a real scenario, this would contain AI-generated content.");
      console.log("The chapter would include dialogue, character interactions, and plot development.");
    }

  } catch (err) {
    console.error("Generation failed:", err.message);
    logger.error("Generation failed", { error: err.message });
  }
}

generate();