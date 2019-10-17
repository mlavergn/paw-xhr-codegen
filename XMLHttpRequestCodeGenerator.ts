/**
 * JavaScritp XMLHttpRequest Paw Code Generator Extension
 *
 * http://github.com/mlavergn/paw-xhr-codegen
 * Copyright (c) Marc Lavergne. All rights reserved.
 * Licensed under the MIT License. See LICENSE file in the project root for full license information.
 */

/**
 * Paw API types
 */
declare function registerCodeGenerator(generator: Function): void;

/**
 * Paw Request field types
 */
interface PawRequest {
  method: string;
  url: string;
  headers: { [key: string]: any };
  body: string;
}

/**
 * Interface for Paw code generator API
 */
interface PawCodeGenerator {
  // generate(context: { [key: string]: any }, requests: PawRequest[], options: { [key: string]: any }): string;
  generate(context: { [key: string]: any }, requests: PawRequest[], options: { [key: string]: any }): string;
}

/**
 * XMLHttpRequest code generator
 */
class XHRCodeGenerator implements PawCodeGenerator {
  static identifier = 'com.marclavergne.PawExtensions.XMLHttpRequestCodeGenerator';
  static title = 'JavaScript (XMLHttpRequest)';
  static fileExtension = 'js';
  static languageHighlighter = 'js';

  title = '// PAW XHRCodeGenerator 1.0.0\n';

  /**
   * Calls registerCodeGenerator function is required
   */
  public static register(): void {
    registerCodeGenerator(XHRCodeGenerator);
  }

  /**
   * Format URL from PAW request
   */
  public formatURL(urlString: string): string {
    const parse = false;
    if (!parse) {
      return urlString;
    } else {
      const pathname = urlString.match('[^:]*://[^/]*(/[^:?]*)');
      return pathname ? pathname[1] : urlString;
    }
  }

  /**
   * Format headers from PAW request
   */
  public formatHeaders(headers: { [key: string]: any }): string {
    const result: string[] = [];
    Object.keys(headers).forEach(
      (key: string) => {
        result.push(`xhr.setRequestHeader('${key}', '${headers[key]}');`);
      }
    );
    return result.join('\n');
  }

  /**
   * Format body from PAW request
   */
  public formatBody(data: string): string | undefined {
    const elements: string[] = [];
    const json = JSON.parse(data);
    Object.keys(json).forEach(
      (key: string) => {
        elements.push(`${key}: '${json[key]}'`);
      }
    );
    return elements.length !== 0 ? `JSON.stringify({\n      ${elements.join(',\n      ')}\n    })` : undefined;
  }

  /**
   * Format PAW request
   */
  public formatRequest(paw: PawRequest): string {
    const components: string[] = [
      '    var xhr = new XMLHttpRequest();',
      `xhr.open(\'${paw.method}\', \'${this.formatURL(paw.url)}\', true);`,
      `${this.formatHeaders(paw.headers)}`,
      'xhr.onload = () => {\n      console.log(xhr.responseText);\n    }',
      `xhr.send(${this.formatBody(paw.body)});`
    ];
    return components.join('\n    ');
  }

  /**
   * Generate formatted code
   */
  public generate(context: { [key: string]: any }, requests: PawRequest[], options: { [key: string]: any }): string {
    const result: string[] = [];
    requests.forEach(
      (request: PawRequest) => {
        result.push(this.formatRequest(request));
      }
    );
    return `${this.title}(\n  () => {\n${result.join('\n')}\n  }\n)();`;
  }
}

// Register the code generator with PAW
XHRCodeGenerator.register();
