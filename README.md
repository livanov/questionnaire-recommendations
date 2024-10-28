Assumptions
  * We'd like to show all the questions on one page.
  * We'd like to keep recording user's answers even if they gave an answer that would make the questionnaire obsolete - e.g. answering "No" to the first question means that essentially the user doesn't benefit from the treatment and it is pointless to continue with the questionnaire.
  * In the task definition API is used as a synonym for "endpoint", meaning that there has to be 2 endpoints for the required functionality.
  * The number of levels of nested questions (e.g. question 2 having nested 2a, 2b, and 2c) will be fairly low - i.e. the questionnaire seems that it wouldn't go deeper than 2-3 levels.
  * Excluding a product (e.g. "tadalafil") means excluding both the 10 and 20 mg versions. Also, while maintaining the questionnaire data it is acceptable to manually type in all the versions and not only the general name of the product.

Other Considerations
  * A wizard-like API could be another approach, where the UI shows 1 question at a time, fetched from the backend as the "next question" to be asked. Then, after each answer the backend can evaluate the new state, based on the new data and decide the next question (e.g. 2b when "Cialis or Tadalafil" was chosen on question 2, or no question at all with no product suggestion, if "No" was answered on question 1).

Other questions and uncertainties
  * Seems strange that we will both define an inclusion and an exclusion on a single question (e.g. 2a, 2b, 2c). On 2a, if the user answered "Yes", then the recommendation engine decides that "Sildenafil 50mg" is a good recommendation, so why would the task definition also exclude "tadalafil", as it seems like easily deductible logic, thus obsolete data.