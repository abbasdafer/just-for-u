'use server';
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMealPlan = generateMealPlan;
/**
 * @fileOverview A meal plan generation AI agent.
 *
 * - generateMealPlan - A function that handles the meal plan generation process.
 * - MealPlanInput - The input type for the generateMealPlan function.
 * - MealPlanOutput - The return type for the generateMealPlan function.
 */
var genkit_1 = require("@/ai/genkit");
var genkit_2 = require("genkit");
var MealPlanInputSchema = genkit_2.z.object({
    calories: genkit_2.z
        .number()
        .describe("The target daily calorie intake for the meal plan."),
    goal: genkit_2.z.enum(["weightLoss", "bulking", "maintenance"]).describe("The user's fitness goal, which will determine the diet's focus."),
});
var MealPlanOutputSchema = genkit_2.z.object({
    planTitle: genkit_2.z.string().describe("A title for the meal plan, reflecting its goal and calorie target, e.g., 'خطة تضخيم - 3000 سعر حراري'."),
    breakfast: genkit_2.z.object({
        meal: genkit_2.z.string().describe("The name of the breakfast meal."),
        description: genkit_2.z.string().describe("A short description of the breakfast meal."),
        calories: genkit_2.z.number().describe("Estimated calories for the breakfast meal."),
        alternatives: genkit_2.z.string().describe("Practical alternatives if the main meal is not available."),
    }),
    lunch: genkit_2.z.object({
        meal: genkit_2.z.string().describe("The name of the lunch meal."),
        description: genkit_2.z.string().describe("A short description of the lunch meal."),
        calories: genkit_2.z.number().describe("Estimated calories for the lunch meal."),
        alternatives: genkit_2.z.string().describe("Practical alternatives if the main meal is not available."),
    }),
    dinner: genkit_2.z.object({
        meal: genkit_2.z.string().describe("The name of the dinner meal."),
        description: genkit_2.z.string().describe("A short description of the dinner meal."),
        calories: genkit_2.z.number().describe("Estimated calories for the dinner meal."),
        alternatives: genkit_2.z.string().describe("Practical alternatives if the main meal is not available."),
    }),
    snacks: genkit_2.z.array(genkit_2.z.object({
        meal: genkit_2.z.string().describe("The name of the snack."),
        description: genkit_2.z.string().describe("A short description of the snack."),
        calories: genkit_2.z.number().describe("Estimated calories for the snack."),
        alternatives: genkit_2.z.string().describe("Practical alternatives if the main snack is not available."),
    })).describe("A list of healthy snacks for the day."),
    totalCalories: genkit_2.z.number().describe("The total estimated calories for the entire day's plan."),
});
function generateMealPlan(input) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, generateMealPlanFlow(input)];
        });
    });
}
var prompt = genkit_1.ai.definePrompt({
    name: 'generateMealPlanPrompt',
    input: { schema: MealPlanInputSchema },
    output: { schema: MealPlanOutputSchema },
    prompt: "You are an expert Iraqi nutritionist creating a one-day meal plan for a user in Iraq.\nThe meal plan must be in Arabic.\nThe target is approximately {{{calories}}} calories.\nThe user's goal is: {{{goal}}}. Tailor the plan accordingly:\n- For \"bulking\": Focus on high-protein and complex carbs.\n- For \"weightLoss\": Create a slight calorie deficit and focus on lean protein and vegetables.\n- For \"maintenance\": Create a balanced plan.\n\nVERY IMPORTANT: All meals and ingredients must be common, affordable, and readily available in Iraq.\n- FOCUS ON: Chicken breast, rice (taman), lentils (adas), chickpeas, local vegetables, yogurt (laban), dates, eggs, oats, and bread (khubz). Use dishes like Chicken Tashreeb, Lentil Soup (Shorbat Adas), grilled chicken/meat, and jajik salad.\n- AVOID: Exotic or expensive ingredients not common in Iraq, like avocado, quinoa, kale, or almond flour.\n\nFor each meal and snack, provide a practical and simple alternative in case the primary option isn't available.\n\nCalculate approximate calories for each item and the total for the day, which should be close to the target.\n",
});
var generateMealPlanFlow = genkit_1.ai.defineFlow({
    name: 'generateMealPlanFlow',
    inputSchema: MealPlanInputSchema,
    outputSchema: MealPlanOutputSchema,
}, function (input) { return __awaiter(void 0, void 0, void 0, function () {
    var output;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prompt(input)];
            case 1:
                output = (_a.sent()).output;
                if (!output) {
                    throw new Error("The AI model failed to generate a meal plan.");
                }
                return [2 /*return*/, output];
        }
    });
}); });
