import React from 'react';
import ReactDOM from 'react-dom';
import Helmet from '../../src';
import Provider from '../../src/Provider';
import { HELMET_ATTRIBUTE } from '../../src/constants';

Helmet.defaultProps.defer = false;

const mount = document.getElementById('mount');

const render = node => {
  ReactDOM.render(<Provider>{node}</Provider>, mount);
};

describe('link tags', () => {
  describe('API', () => {
    it('updates link tags', () => {
      render(
        <Helmet
          link={[
            {
              href: 'http://localhost/helmet',
              rel: 'canonical',
            },
            {
              href: 'http://localhost/style.css',
              rel: 'stylesheet',
              type: 'text/css',
            },
          ]}
        />
      );

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);

      expect(existingTags).toBeDefined();

      const filteredTags = [].slice
        .call(existingTags)
        .filter(
          tag =>
            (tag.getAttribute('href') === 'http://localhost/style.css' &&
              tag.getAttribute('rel') === 'stylesheet' &&
              tag.getAttribute('type') === 'text/css') ||
            (tag.getAttribute('href') === 'http://localhost/helmet' &&
              tag.getAttribute('rel') === 'canonical')
        );

      expect(filteredTags.length).toBeGreaterThanOrEqual(2);
    });

    it('clears all link tags if none are specified', () => {
      render(
        <Helmet
          link={[
            {
              href: 'http://localhost/helmet',
              rel: 'canonical',
            },
          ]}
        />
      );

      render(<Helmet />);

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it("tags without 'href' or 'rel' are not accepted, even if they are valid for other tags", () => {
      render(<Helmet link={[{ 'http-equiv': "won't work" }]} />);

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it("tags 'rel' and 'href' properly use 'rel' as the primary identification for this tag, regardless of ordering", () => {
      render(
        <div>
          <Helmet
            link={[
              {
                href: 'http://localhost/helmet',
                rel: 'canonical',
              },
            ]}
          />
          <Helmet
            link={[
              {
                rel: 'canonical',
                href: 'http://localhost/helmet/new',
              },
            ]}
          />
          <Helmet
            link={[
              {
                href: 'http://localhost/helmet/newest',
                rel: 'canonical',
              },
            ]}
          />
        </div>
      );

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);
      const firstTag = existingTags[0];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('rel')).toEqual('canonical');
      expect(firstTag.getAttribute('href')).toEqual('http://localhost/helmet/newest');
      expect(firstTag.outerHTML).toMatchSnapshot();
    });

    it("tags with rel='stylesheet' uses the href as the primary identification of the tag, regardless of ordering", () => {
      render(
        <div>
          <Helmet
            link={[
              {
                href: 'http://localhost/style.css',
                rel: 'stylesheet',
                type: 'text/css',
                media: 'all',
              },
            ]}
          />
          <Helmet
            link={[
              {
                rel: 'stylesheet',
                href: 'http://localhost/inner.css',
                type: 'text/css',
                media: 'all',
              },
            ]}
          />
        </div>
      );

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);
      const firstTag = existingTags[0];
      const secondTag = existingTags[1];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('href')).toEqual('http://localhost/style.css');
      expect(firstTag.getAttribute('rel')).toEqual('stylesheet');
      expect(firstTag.getAttribute('type')).toEqual('text/css');
      expect(firstTag.getAttribute('media')).toEqual('all');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag.getAttribute('rel')).toEqual('stylesheet');
      expect(secondTag.getAttribute('href')).toEqual('http://localhost/inner.css');
      expect(secondTag.getAttribute('type')).toEqual('text/css');
      expect(secondTag.getAttribute('media')).toEqual('all');
      expect(secondTag.outerHTML).toMatchSnapshot();
    });

    it('sets link tags based on deepest nested component', () => {
      render(
        <div>
          <Helmet
            link={[
              {
                rel: 'canonical',
                href: 'http://localhost/helmet',
              },
              {
                href: 'http://localhost/style.css',
                rel: 'stylesheet',
                type: 'text/css',
                media: 'all',
              },
            ]}
          />
          <Helmet
            link={[
              {
                rel: 'canonical',
                href: 'http://localhost/helmet/innercomponent',
              },
              {
                href: 'http://localhost/inner.css',
                rel: 'stylesheet',
                type: 'text/css',
                media: 'all',
              },
            ]}
          />
        </div>
      );

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);
      const firstTag = existingTags[0];
      const secondTag = existingTags[1];
      const thirdTag = existingTags[2];

      expect(existingTags).toBeDefined();
      expect(existingTags.length).toBeGreaterThanOrEqual(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('href')).toEqual('http://localhost/style.css');
      expect(firstTag.getAttribute('rel')).toEqual('stylesheet');
      expect(firstTag.getAttribute('type')).toEqual('text/css');
      expect(firstTag.getAttribute('media')).toEqual('all');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag.getAttribute('href')).toEqual('http://localhost/helmet/innercomponent');
      expect(secondTag.getAttribute('rel')).toEqual('canonical');
      expect(secondTag.outerHTML).toMatchSnapshot();

      expect(thirdTag).toBeInstanceOf(Element);
      expect(thirdTag.getAttribute).toBeDefined();
      expect(thirdTag.getAttribute('href')).toEqual('http://localhost/inner.css');
      expect(thirdTag.getAttribute('rel')).toEqual('stylesheet');
      expect(thirdTag.getAttribute('type')).toEqual('text/css');
      expect(thirdTag.getAttribute('media')).toEqual('all');
      expect(thirdTag.outerHTML).toMatchSnapshot();
    });

    it('allows duplicate link tags if specified in the same component', () => {
      render(
        <Helmet
          link={[
            {
              rel: 'canonical',
              href: 'http://localhost/helmet',
            },
            {
              rel: 'canonical',
              href: 'http://localhost/helmet/component',
            },
          ]}
        />
      );

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);
      const firstTag = existingTags[0];
      const secondTag = existingTags[1];

      expect(existingTags).toBeDefined();
      expect(existingTags.length).toBeGreaterThanOrEqual(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('rel')).toEqual('canonical');
      expect(firstTag.getAttribute('href')).toEqual('http://localhost/helmet');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag.getAttribute('rel')).toEqual('canonical');
      expect(secondTag.getAttribute('href')).toEqual('http://localhost/helmet/component');
      expect(secondTag.outerHTML).toMatchSnapshot();
    });

    it('overrides duplicate link tags with a single link tag in a nested component', () => {
      render(
        <div>
          <Helmet
            link={[
              {
                rel: 'canonical',
                href: 'http://localhost/helmet',
              },
              {
                rel: 'canonical',
                href: 'http://localhost/helmet/component',
              },
            ]}
          />
          <Helmet
            link={[
              {
                rel: 'canonical',
                href: 'http://localhost/helmet/innercomponent',
              },
            ]}
          />
        </div>
      );

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);
      const firstTag = existingTags[0];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('rel')).toEqual('canonical');
      expect(firstTag.getAttribute('href')).toEqual('http://localhost/helmet/innercomponent');
      expect(firstTag.outerHTML).toMatchSnapshot();
    });

    it('overrides single link tag with duplicate link tags in a nested component', () => {
      render(
        <div>
          <Helmet
            link={[
              {
                rel: 'canonical',
                href: 'http://localhost/helmet',
              },
            ]}
          />
          <Helmet
            link={[
              {
                rel: 'canonical',
                href: 'http://localhost/helmet/component',
              },
              {
                rel: 'canonical',
                href: 'http://localhost/helmet/innercomponent',
              },
            ]}
          />
        </div>
      );

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);
      const firstTag = existingTags[0];
      const secondTag = existingTags[1];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('rel')).toEqual('canonical');
      expect(firstTag.getAttribute('href')).toEqual('http://localhost/helmet/component');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag.getAttribute('rel')).toEqual('canonical');
      expect(secondTag.getAttribute('href')).toEqual('http://localhost/helmet/innercomponent');
      expect(secondTag.outerHTML).toMatchSnapshot();
    });

    it('does not render tag when primary attribute is null', () => {
      render(
        <Helmet
          link={[
            { rel: 'icon', sizes: '192x192', href: null },
            {
              rel: 'canonical',
              href: 'http://localhost/helmet/component',
            },
          ]}
        />
      );

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);
      const firstTag = existingTags[0];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('rel')).toEqual('canonical');
      expect(firstTag.getAttribute('href')).toEqual('http://localhost/helmet/component');
      expect(firstTag.outerHTML).toMatchSnapshot();
    });
  });

  describe('Declarative API', () => {
    it('updates link tags', () => {
      render(
        <Helmet>
          <link href="http://localhost/helmet" rel="canonical" />
          <link href="http://localhost/style.css" rel="stylesheet" type="text/css" />
        </Helmet>
      );

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);

      expect(existingTags).toBeDefined();

      const filteredTags = [].slice
        .call(existingTags)
        .filter(
          tag =>
            (tag.getAttribute('href') === 'http://localhost/style.css' &&
              tag.getAttribute('rel') === 'stylesheet' &&
              tag.getAttribute('type') === 'text/css') ||
            (tag.getAttribute('href') === 'http://localhost/helmet' &&
              tag.getAttribute('rel') === 'canonical')
        );

      expect(filteredTags.length).toBeGreaterThanOrEqual(2);
    });

    it('clears all link tags if none are specified', () => {
      render(
        <Helmet>
          <link href="http://localhost/helmet" rel="canonical" />
        </Helmet>
      );

      render(<Helmet />);

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it("tags without 'href' or 'rel' are not accepted, even if they are valid for other tags", () => {
      render(
        <Helmet>
          <link httpEquiv="won't work" />
        </Helmet>
      );

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(0);
    });

    it("tags 'rel' and 'href' properly use 'rel' as the primary identification for this tag, regardless of ordering", () => {
      render(
        <div>
          <Helmet>
            <link href="http://localhost/helmet" rel="canonical" />
          </Helmet>
          <Helmet>
            <link rel="canonical" href="http://localhost/helmet/new" />
          </Helmet>
          <Helmet>
            <link href="http://localhost/helmet/newest" rel="canonical" />
          </Helmet>
        </div>
      );

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);
      const firstTag = existingTags[0];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('rel')).toEqual('canonical');
      expect(firstTag.getAttribute('href')).toEqual('http://localhost/helmet/newest');
      expect(firstTag.outerHTML).toMatchSnapshot();
    });

    it("tags with rel='stylesheet' uses the href as the primary identification of the tag, regardless of ordering", () => {
      render(
        <div>
          <Helmet>
            <link href="http://localhost/style.css" rel="stylesheet" type="text/css" media="all" />
          </Helmet>
          <Helmet>
            <link rel="stylesheet" href="http://localhost/inner.css" type="text/css" media="all" />
          </Helmet>
        </div>
      );

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);
      const firstTag = existingTags[0];
      const secondTag = existingTags[1];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('href')).toEqual('http://localhost/style.css');
      expect(firstTag.getAttribute('rel')).toEqual('stylesheet');
      expect(firstTag.getAttribute('type')).toEqual('text/css');
      expect(firstTag.getAttribute('media')).toEqual('all');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag.getAttribute('rel')).toEqual('stylesheet');
      expect(secondTag.getAttribute('href')).toEqual('http://localhost/inner.css');
      expect(secondTag.getAttribute('type')).toEqual('text/css');
      expect(secondTag.getAttribute('media')).toEqual('all');
      expect(secondTag.outerHTML).toMatchSnapshot();
    });

    it('sets link tags based on deepest nested component', () => {
      render(
        <div>
          <Helmet>
            <link rel="canonical" href="http://localhost/helmet" />
            <link href="http://localhost/style.css" rel="stylesheet" type="text/css" media="all" />
          </Helmet>
          <Helmet>
            <link rel="canonical" href="http://localhost/helmet/innercomponent" />
            <link href="http://localhost/inner.css" rel="stylesheet" type="text/css" media="all" />
          </Helmet>
        </div>
      );

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);
      const firstTag = existingTags[0];
      const secondTag = existingTags[1];
      const thirdTag = existingTags[2];

      expect(existingTags).toBeDefined();
      expect(existingTags.length).toBeGreaterThanOrEqual(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('href')).toEqual('http://localhost/style.css');
      expect(firstTag.getAttribute('rel')).toEqual('stylesheet');
      expect(firstTag.getAttribute('type')).toEqual('text/css');
      expect(firstTag.getAttribute('media')).toEqual('all');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag.getAttribute('href')).toEqual('http://localhost/helmet/innercomponent');
      expect(secondTag.getAttribute('rel')).toEqual('canonical');
      expect(secondTag.outerHTML).toMatchSnapshot();

      expect(thirdTag).toBeInstanceOf(Element);
      expect(thirdTag.getAttribute).toBeDefined();
      expect(thirdTag.getAttribute('href')).toEqual('http://localhost/inner.css');
      expect(thirdTag.getAttribute('rel')).toEqual('stylesheet');
      expect(thirdTag.getAttribute('type')).toEqual('text/css');
      expect(thirdTag.getAttribute('media')).toEqual('all');
      expect(thirdTag.outerHTML).toMatchSnapshot();
    });

    it('allows duplicate link tags if specified in the same component', () => {
      render(
        <Helmet>
          <link rel="canonical" href="http://localhost/helmet" />
          <link rel="canonical" href="http://localhost/helmet/component" />
        </Helmet>
      );

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);
      const firstTag = existingTags[0];
      const secondTag = existingTags[1];

      expect(existingTags).toBeDefined();
      expect(existingTags.length).toBeGreaterThanOrEqual(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('rel')).toEqual('canonical');
      expect(firstTag.getAttribute('href')).toEqual('http://localhost/helmet');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag.getAttribute('rel')).toEqual('canonical');
      expect(secondTag.getAttribute('href')).toEqual('http://localhost/helmet/component');
      expect(secondTag.outerHTML).toMatchSnapshot();
    });

    it('overrides duplicate link tags with a single link tag in a nested component', () => {
      render(
        <div>
          <Helmet>
            <link rel="canonical" href="http://localhost/helmet" />
            <link rel="canonical" href="http://localhost/helmet/component" />
          </Helmet>
          <Helmet>
            <link rel="canonical" href="http://localhost/helmet/innercomponent" />
          </Helmet>
        </div>
      );

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);
      const firstTag = existingTags[0];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('rel')).toEqual('canonical');
      expect(firstTag.getAttribute('href')).toEqual('http://localhost/helmet/innercomponent');
      expect(firstTag.outerHTML).toMatchSnapshot();
    });

    it('overrides single link tag with duplicate link tags in a nested component', () => {
      render(
        <div>
          <Helmet>
            <link rel="canonical" href="http://localhost/helmet" />
          </Helmet>
          <Helmet>
            <link rel="canonical" href="http://localhost/helmet/component" />
            <link rel="canonical" href="http://localhost/helmet/innercomponent" />
          </Helmet>
        </div>
      );

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);
      const firstTag = existingTags[0];
      const secondTag = existingTags[1];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(2);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('rel')).toEqual('canonical');
      expect(firstTag.getAttribute('href')).toEqual('http://localhost/helmet/component');
      expect(firstTag.outerHTML).toMatchSnapshot();

      expect(secondTag).toBeInstanceOf(Element);
      expect(secondTag.getAttribute).toBeDefined();
      expect(secondTag.getAttribute('rel')).toEqual('canonical');
      expect(secondTag.getAttribute('href')).toEqual('http://localhost/helmet/innercomponent');
      expect(secondTag.outerHTML).toMatchSnapshot();
    });

    it('does not render tag when primary attribute is null', () => {
      render(
        <Helmet>
          <link rel="icon" sizes="192x192" href={null} />
          <link rel="canonical" href="http://localhost/helmet/component" />
        </Helmet>
      );

      const tagNodes = document.head.querySelectorAll(`link[${HELMET_ATTRIBUTE}]`);
      const existingTags = [].slice.call(tagNodes);
      const firstTag = existingTags[0];

      expect(existingTags).toBeDefined();
      expect(existingTags).toHaveLength(1);

      expect(firstTag).toBeInstanceOf(Element);
      expect(firstTag.getAttribute).toBeDefined();
      expect(firstTag.getAttribute('rel')).toEqual('canonical');
      expect(firstTag.getAttribute('href')).toEqual('http://localhost/helmet/component');
      expect(firstTag.outerHTML).toMatchSnapshot();
    });
  });
});