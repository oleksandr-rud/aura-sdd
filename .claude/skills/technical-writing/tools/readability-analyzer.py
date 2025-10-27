#!/usr/bin/env python3
"""
Readability Analyzer for Technical Writing

This script analyzes text for readability metrics including Flesch-Kincaid scores,
sentence length, paragraph length, and other quality indicators. It provides
recommendations for improving technical documentation readability.
"""

import re
import math
import sys
from typing import Dict, List, Tuple
import argparse

class ReadabilityAnalyzer:
    def __init__(self):
        self.text = ""
        self.sentences = []
        self.words = []
        self.syllables = []

    def load_text(self, text: str):
        """Load text for analysis."""
        self.text = text.strip()
        self._parse_text()

    def load_text_from_file(self, filepath: str):
        """Load text from file."""
        try:
            with open(filepath, 'r', encoding='utf-8') as file:
                self.load_text(file.read())
        except FileNotFoundError:
            print(f"Error: File '{filepath}' not found.")
            sys.exit(1)
        except Exception as e:
            print(f"Error reading file: {e}")
            sys.exit(1)

    def _parse_text(self):
        """Parse text into sentences, words, and syllables."""
        # Split into sentences (basic approach)
        self.sentences = re.split(r'[.!?]+', self.text)
        self.sentences = [s.strip() for s in self.sentences if s.strip()]

        # Split into words
        words = re.findall(r'\b[a-zA-Z]+\b', self.text.lower())
        self.words = words

        # Count syllables for each word
        self.syllables = [self._count_syllables(word) for word in self.words]

    def _count_syllables(self, word: str) -> int:
        """Count syllables in a word using common English rules."""
        if len(word) <= 3:
            return 1

        word = word.lower()
        vowels = "aeiouy"
        syllable_count = 0
        prev_char_was_vowel = False

        for char in word:
            is_vowel = char in vowels
            if is_vowel and not prev_char_was_vowel:
                syllable_count += 1
            prev_char_was_vowel = is_vowel

        # Handle silent 'e' at the end
        if word.endswith('e'):
            syllable_count -= 1

        # Ensure at least one syllable
        return max(1, syllable_count)

    def calculate_flesch_kincaid_grade(self) -> float:
        """Calculate Flesch-Kincaid Grade Level."""
        if len(self.sentences) == 0 or len(self.words) == 0:
            return 0.0

        avg_sentence_length = len(self.words) / len(self.sentences)
        avg_syllables_per_word = sum(self.syllables) / len(self.words)

        # Flesch-Kincaid Grade Level formula
        grade_level = (0.39 * avg_sentence_length) + (11.8 * avg_syllables_per_word) - 15.59
        return round(grade_level, 1)

    def calculate_flesch_reading_ease(self) -> float:
        """Calculate Flesch Reading Ease score."""
        if len(self.sentences) == 0 or len(self.words) == 0:
            return 0.0

        avg_sentence_length = len(self.words) / len(self.sentences)
        avg_syllables_per_word = sum(self.syllables) / len(self.words)

        # Flesch Reading Ease formula
        reading_ease = 206.835 - (1.015 * avg_sentence_length) - (84.6 * avg_syllables_per_word)
        return round(reading_ease, 1)

    def get_sentence_analysis(self) -> Dict:
        """Analyze sentence length and structure."""
        if not self.sentences:
            return {
                'total_sentences': 0,
                'avg_sentence_length': 0,
                'max_sentence_length': 0,
                'long_sentences': [],
                'very_long_sentences': []
            }

        sentence_lengths = []
        long_sentences = []
        very_long_sentences = []

        for i, sentence in enumerate(self.sentences):
            words_in_sentence = len(re.findall(r'\b\w+\b', sentence))
            sentence_lengths.append(words_in_sentence)

            sentence_preview = sentence[:50] + "..." if len(sentence) > 50 else sentence
            sentence_info = {
                'sentence_number': i + 1,
                'length': words_in_sentence,
                'preview': sentence_preview
            }

            if words_in_sentence > 25:
                very_long_sentences.append(sentence_info)
            elif words_in_sentence > 20:
                long_sentences.append(sentence_info)

        return {
            'total_sentences': len(self.sentences),
            'avg_sentence_length': round(sum(sentence_lengths) / len(sentence_lengths), 1),
            'max_sentence_length': max(sentence_lengths) if sentence_lengths else 0,
            'long_sentences': long_sentences,  # 20-25 words
            'very_long_sentences': very_long_sentences  # >25 words
        }

    def get_paragraph_analysis(self) -> Dict:
        """Analyze paragraph structure and length."""
        paragraphs = [p.strip() for p in self.text.split('\n\n') if p.strip()]

        if not paragraphs:
            return {
                'total_paragraphs': 0,
                'avg_paragraph_length': 0,
                'max_paragraph_length': 0,
                'long_paragraphs': []
            }

        paragraph_lengths = []
        long_paragraphs = []

        for i, paragraph in enumerate(paragraphs):
            words_in_paragraph = len(re.findall(r'\b\w+\b', paragraph))
            paragraph_lengths.append(words_in_paragraph)

            paragraph_preview = paragraph[:75] + "..." if len(paragraph) > 75 else paragraph

            if words_in_paragraph > 100:  # More than ~6 lines
                long_paragraphs.append({
                    'paragraph_number': i + 1,
                    'length': words_in_paragraph,
                    'preview': paragraph_preview
                })

        return {
            'total_paragraphs': len(paragraphs),
            'avg_paragraph_length': round(sum(paragraph_lengths) / len(paragraph_lengths), 1),
            'max_paragraph_length': max(paragraph_lengths) if paragraph_lengths else 0,
            'long_paragraphs': long_paragraphs
        }

    def get_vocabulary_analysis(self) -> Dict:
        """Analyze vocabulary complexity."""
        if not self.words:
            return {
                'total_words': 0,
                'unique_words': 0,
                'avg_word_length': 0,
                'complex_words': 0,
                'complex_word_percentage': 0
            }

        unique_words = set(self.words)
        word_lengths = [len(word) for word in self.words]
        avg_word_length = sum(word_lengths) / len(word_lengths)

        # Complex words are > 6 characters or > 3 syllables
        complex_words = 0
        for i, word in enumerate(self.words):
            if len(word) > 6 or self.syllables[i] > 3:
                complex_words += 1

        return {
            'total_words': len(self.words),
            'unique_words': len(unique_words),
            'avg_word_length': round(avg_word_length, 1),
            'complex_words': complex_words,
            'complex_word_percentage': round((complex_words / len(self.words)) * 100, 1)
        }

    def generate_recommendations(self) -> List[str]:
        """Generate recommendations for improving readability."""
        recommendations = []

        # Analyze grade level
        grade_level = self.calculate_flesch_kincaid_grade()
        if grade_level > 12:
            recommendations.append(f"📚 Grade level ({grade_level}) is too high. Aim for 8-10 by simplifying language and shortening sentences.")
        elif grade_level < 6:
            recommendations.append(f"📖 Grade level ({grade_level}) is quite low. Consider adding more detail for technical content.")

        # Analyze reading ease
        reading_ease = self.calculate_flesch_reading_ease()
        if reading_ease < 30:
            recommendations.append(f"🔍 Reading ease score ({reading_ease}) is very difficult. Simplify sentence structure and vocabulary.")
        elif reading_ease > 90:
            recommendations.append(f"😊 Reading ease score ({reading_ease}) is very easy. Ensure technical accuracy isn't compromised.")

        # Analyze sentences
        sentence_analysis = self.get_sentence_analysis()
        if sentence_analysis['very_long_sentences']:
            recommendations.append(f"📝 Found {len(sentence_analysis['very_long_sentences'])} very long sentences (>25 words). Break them into shorter, clearer sentences.")

        if sentence_analysis['long_sentences']:
            recommendations.append(f"📄 Found {len(sentence_analysis['long_sentences'])} long sentences (20-25 words). Consider simplifying these.")

        # Analyze paragraphs
        paragraph_analysis = self.get_paragraph_analysis()
        if paragraph_analysis['long_paragraphs']:
            recommendations.append(f"📋 Found {len(paragraph_analysis['long_paragraphs'])} long paragraphs (>100 words). Break them into shorter, focused paragraphs.")

        # Analyze vocabulary
        vocab_analysis = self.get_vocabulary_analysis()
        if vocab_analysis['complex_word_percentage'] > 25:
            recommendations.append(f"🔤 Complex word percentage ({vocab_analysis['complex_word_percentage']}%) is high. Consider using simpler alternatives or explaining complex terms.")

        if not recommendations:
            recommendations.append("✅ Great job! Your text meets all readability recommendations.")

        return recommendations

    def generate_report(self) -> str:
        """Generate a comprehensive readability report."""
        report = []
        report.append("# Readability Analysis Report")
        report.append(f"Generated: {self._get_timestamp()}")
        report.append("")

        # Overall scores
        grade_level = self.calculate_flesch_kincaid_grade()
        reading_ease = self.calculate_flesch_reading_ease()

        report.append("## Overall Scores")
        report.append(f"**Flesch-Kincaid Grade Level**: {grade_level}")
        report.append(f"**Flesch Reading Ease**: {reading_ease}")
        report.append(f"**Reading Level Interpretation**: {self._interpret_reading_level(grade_level)}")
        report.append(f"**Reading Ease Interpretation**: {self._interpret_reading_ease(reading_ease)}")
        report.append("")

        # Text statistics
        vocab_analysis = self.get_vocabulary_analysis()
        report.append("## Text Statistics")
        report.append(f"**Total Words**: {vocab_analysis['total_words']}")
        report.append(f"**Unique Words**: {vocab_analysis['unique_words']}")
        report.append(f"**Average Word Length**: {vocab_analysis['avg_word_length']} characters")
        report.append(f"**Complex Words**: {vocab_analysis['complex_words']} ({vocab_analysis['complex_word_percentage']}%)")
        report.append("")

        # Sentence analysis
        sentence_analysis = self.get_sentence_analysis()
        report.append("## Sentence Analysis")
        report.append(f"**Total Sentences**: {sentence_analysis['total_sentences']}")
        report.append(f"**Average Sentence Length**: {sentence_analysis['avg_sentence_length']} words")
        report.append(f"**Longest Sentence**: {sentence_analysis['max_sentence_length']} words")
        report.append("")

        if sentence_analysis['very_long_sentences']:
            report.append("### Very Long Sentences (>25 words)")
            for sentence in sentence_analysis['very_long_sentences'][:5]:  # Show first 5
                report.append(f"- **Sentence {sentence['sentence_number']}**: {sentence['length']} words")
                report.append(f"  - Preview: \"{sentence['preview']}\"")
            report.append("")

        # Paragraph analysis
        paragraph_analysis = self.get_paragraph_analysis()
        report.append("## Paragraph Analysis")
        report.append(f"**Total Paragraphs**: {paragraph_analysis['total_paragraphs']}")
        report.append(f"**Average Paragraph Length**: {paragraph_analysis['avg_paragraph_length']} words")
        report.append(f"**Longest Paragraph**: {paragraph_analysis['max_paragraph_length']} words")
        report.append("")

        if paragraph_analysis['long_paragraphs']:
            report.append("### Long Paragraphs (>100 words)")
            for paragraph in paragraph_analysis['long_paragraphs'][:3]:  # Show first 3
                report.append(f"- **Paragraph {paragraph['paragraph_number']}**: {paragraph['length']} words")
                report.append(f"  - Preview: \"{paragraph['preview']}\"")
            report.append("")

        # Recommendations
        recommendations = self.generate_recommendations()
        report.append("## Recommendations")
        for recommendation in recommendations:
            report.append(f"- {recommendation}")
        report.append("")

        # Quality assessment
        report.append("## Quality Assessment")
        quality_score = self._calculate_quality_score()
        report.append(f"**Overall Quality Score**: {quality_score}/100")
        report.append(f"**Quality Rating**: {self._get_quality_rating(quality_score)}")
        report.append("")

        # Target metrics for technical writing
        report.append("## Target Metrics for Technical Writing")
        report.append("- **Flesch-Kincaid Grade Level**: 8-10 (adjustable by audience)")
        report.append("- **Average Sentence Length**: 15-20 words")
        report.append("- **Maximum Sentence Length**: 25 words")
        report.append("- **Paragraph Length**: 50-100 words")
        report.append("- **Complex Word Percentage**: <25%")
        report.append("")

        return "\n".join(report)

    def _interpret_reading_level(self, grade_level: float) -> str:
        """Interpret Flesch-Kincaid grade level."""
        if grade_level <= 6:
            return "Very easy (6th grade or lower)"
        elif grade_level <= 8:
            return "Easy (7th-8th grade)"
        elif grade_level <= 10:
            return "Fairly easy (9th-10th grade) - Good for most technical content"
        elif grade_level <= 12:
            return "Standard (11th-12th grade)"
        elif grade_level <= 15:
            return "Fairly difficult (College level)"
        else:
            return "Difficult (Graduate level)"

    def _interpret_reading_ease(self, reading_ease: float) -> str:
        """Interpret Flesch Reading Ease score."""
        if reading_ease >= 90:
            return "Very easy"
        elif reading_ease >= 80:
            return "Easy"
        elif reading_ease >= 70:
            return "Fairly easy"
        elif reading_ease >= 60:
            return "Standard"
        elif reading_ease >= 50:
            return "Fairly difficult"
        elif reading_ease >= 30:
            return "Difficult"
        else:
            return "Very difficult"

    def _calculate_quality_score(self) -> int:
        """Calculate overall quality score (0-100)."""
        score = 100

        # Grade level scoring
        grade_level = self.calculate_flesch_kincaid_grade()
        if 8 <= grade_level <= 10:
            score += 0  # Perfect
        elif 6 <= grade_level <= 12:
            score -= 5  # Good
        else:
            score -= 15  # Needs improvement

        # Sentence length scoring
        sentence_analysis = self.get_sentence_analysis()
        if sentence_analysis['very_long_sentences']:
            score -= len(sentence_analysis['very_long_sentences']) * 3
        if sentence_analysis['long_sentences']:
            score -= len(sentence_analysis['long_sentences'])

        # Paragraph length scoring
        paragraph_analysis = self.get_paragraph_analysis()
        if paragraph_analysis['long_paragraphs']:
            score -= len(paragraph_analysis['long_paragraphs']) * 2

        # Vocabulary complexity scoring
        vocab_analysis = self.get_vocabulary_analysis()
        if vocab_analysis['complex_word_percentage'] > 25:
            score -= (vocab_analysis['complex_word_percentage'] - 25)

        return max(0, min(100, score))

    def _get_quality_rating(self, score: int) -> str:
        """Get quality rating based on score."""
        if score >= 90:
            return "Excellent"
        elif score >= 80:
            return "Very Good"
        elif score >= 70:
            return "Good"
        elif score >= 60:
            return "Fair"
        else:
            return "Needs Improvement"

    def _get_timestamp(self) -> str:
        """Get current timestamp."""
        from datetime import datetime
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def main():
    parser = argparse.ArgumentParser(description="Readability Analyzer for Technical Writing")
    parser.add_argument("input", help="Text file to analyze or text string")
    parser.add_argument("--output", help="Output file for report")
    parser.add_argument("--text", action="store_true", help="Treat input as text string instead of file")
    parser.add_argument("--format", choices=["text", "json"], default="text", help="Output format")

    args = parser.parse_args()

    analyzer = ReadabilityAnalyzer()

    # Load input
    if args.text:
        analyzer.load_text(args.input)
    else:
        analyzer.load_text_from_file(args.input)

    # Generate report
    if args.format == "json":
        import json
        report_data = {
            "flesch_kincaid_grade": analyzer.calculate_flesch_kincaid_grade(),
            "flesch_reading_ease": analyzer.calculate_flesch_reading_ease(),
            "sentence_analysis": analyzer.get_sentence_analysis(),
            "paragraph_analysis": analyzer.get_paragraph_analysis(),
            "vocabulary_analysis": analyzer.get_vocabulary_analysis(),
            "recommendations": analyzer.generate_recommendations(),
            "quality_score": analyzer._calculate_quality_score()
        }
        report = json.dumps(report_data, indent=2)
    else:
        report = analyzer.generate_report()

    # Output report
    if args.output:
        with open(args.output, 'w') as file:
            file.write(report)
        print(f"Readability report saved to {args.output}")
    else:
        print(report)

if __name__ == "__main__":
    main()