#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

#define MAX_WORDS 100
#define MAX_LENGTH 20

// Function to tokenize text into words
void tokenize(const char* text, char words[MAX_WORDS][MAX_LENGTH], int* count) {
    const char* delimiter = " ";
    char temp[1000];
    strcpy(temp, text);
    char* token = strtok(temp, delimiter);
    *count = 0;

    while (token != NULL) {
        strcpy(words[(*count)++], token);
        token = strtok(NULL, delimiter);
    }
}

// Function to calculate term frequency (TF)
void computeTF(char words[MAX_WORDS][MAX_LENGTH], int count, char vocab[MAX_WORDS][MAX_LENGTH], int vocabCount, double tf[MAX_WORDS]) {
    for (int i = 0; i < vocabCount; i++) {
        int freq = 0;
        for (int j = 0; j < count; j++) {
            if (strcmp(vocab[i], words[j]) == 0) {
                freq++;
            }
        }
        tf[i] = (double)freq / count;
    }
}

// Function to calculate dot product
double dotProduct(double* vec1, double* vec2, int size) {
    double result = 0;
    for (int i = 0; i < size; i++) {
        result += vec1[i] * vec2[i];
    }
    return result;
}

// Function to calculate vector magnitude
double magnitude(double* vec, int size) {
    double result = 0;
    for (int i = 0; i < size; i++) {
        result += vec[i] * vec[i];
    }
    return sqrt(result);
}

// Function to calculate cosine similarity
double cosineSimilarity(double* vec1, double* vec2, int size) {
    double mag1 = magnitude(vec1, size);
    double mag2 = magnitude(vec2, size);

    if (mag1 == 0 || mag2 == 0) {
        return 0.0;  // Avoid division by zero
    }

    return dotProduct(vec1, vec2, size) / (mag1 * mag2);
}

int main() {
    const char* jobDescription = "Data Scientist Python Machine Learning Data Analysis";
    const char* resume1 = "Python Machine Learning Data Analysis Data Visualization";
    const char* resume2 = "Java Python Development Spring Framework";

    // Tokenize texts
    char jobWords[MAX_WORDS][MAX_LENGTH], resume1Words[MAX_WORDS][MAX_LENGTH], resume2Words[MAX_WORDS][MAX_LENGTH];
    int jobCount, resume1Count, resume2Count;

    tokenize(jobDescription, jobWords, &jobCount);
    tokenize(resume1, resume1Words, &resume1Count);
    tokenize(resume2, resume2Words, &resume2Count);

    // Create vocabulary (unique words)
    char vocab[MAX_WORDS][MAX_LENGTH];
    int vocabCount = 0;

    for (int i = 0; i < jobCount; i++) {
        strcpy(vocab[vocabCount++], jobWords[i]);
    }

    // Compute TF vectors
    double jobTF[MAX_WORDS] = {0}, resume1TF[MAX_WORDS] = {0}, resume2TF[MAX_WORDS] = {0};
    computeTF(jobWords, jobCount, vocab, vocabCount, jobTF);
    computeTF(resume1Words, resume1Count, vocab, vocabCount, resume1TF);
    computeTF(resume2Words, resume2Count, vocab, vocabCount, resume2TF);

    // Compute cosine similarity
    double similarity1 = cosineSimilarity(jobTF, resume1TF, vocabCount);
    double similarity2 = cosineSimilarity(jobTF, resume2TF, vocabCount);

    // Display results as percentages
    printf("Person A: %.2f%%\n", similarity1 * 100);
    printf("Person B: %.2f%%\n", similarity2 * 100);

    return 0;
}
