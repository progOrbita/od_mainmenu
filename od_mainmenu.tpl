{*
{function name="menu" nodes=[] depth=0}
  {strip}
    {if $nodes|count}
      <ul data-depth="{$depth}">
        {foreach from=$nodes item=node}
          <li class="{$node.type}{if $node.current} current{/if}">
            <a href="{$node.url}" {if $node.open_in_new_window} target="_blank" {/if}>{$node.label}</a>
            <div>
              {menu nodes=$node.children depth=$node.depth}
              {if $node.image_urls|count}
                <div class="menu-images-container">
                  {foreach from=$node.image_urls item=image_url}
                    <img src="{$image_url}">
                  {/foreach}
                </div>
              {/if}
            </div>
          </li>
        {/foreach}
      </ul>
    {/if}
  {/strip}
{/function}

<div class="menu">
    {menu nodes=$menu.children}
</div>
*}
{assign var=_isparent value=$parents}

{assign var=_counter value=0}
{function name="menu" nodes=[] depth=0 parent=null}
  {if $nodes|count}
    <ul {if $depth > 0}class="top-menu"{if $depth == 3} data-toggle="collapse"{/if}{else}class="mainmenu top-menu js-top-menu" id="top-menu"{/if} data-depth="{$depth}">
      {foreach from=$nodes item=node}
        <li class="{$node.type}{if $node.current} current {/if}" id="{$node.page_identifier}">
          {assign var=_counter value=$_counter+1}
          {if $_isparent[{$node.page_identifier}]}
            {assign var=_expand_id value=10|mt_rand:100000}
            <div data-target="#top_sub_menu_{$_expand_id}" data-toggle="collapse" class="item-header collapsed" aria-expanded="false">
              <a class="nav-link" href="{$node.url}" data-depth="{$depth}"{if $node.open_in_new_window} target="_blank"{/if}>{$node.label}</a>
              {* Cannot use page identifier as we can have the same page several times *}
              <span class="nav-link d-touch-block {if $depth === 1}right{/if}">
                <span class="collapse-icon"></span>
              </span>
            </div>
            
          {else}
            <div class="item-header">
              <a class="nav-link" href="{$node.url}" data-depth="{$depth}"{if $node.open_in_new_window} target="_blank"{/if}>{$node.label}</a>
            </div>
          {/if}
  
          {if $_isparent[{$node.page_identifier}]}
            <div class="{if $depth === 0}popover {/if}collapse" id="top_sub_menu_{$_expand_id}">
              {menu nodes=$node.children depth=$node.depth parent=$node}
            </div>
          {/if}
        </li>
      {/foreach}
    </ul>
  {/if}
{/function}

{*<div class="menu js-top-menu col">*}
    {menu nodes=$menu.children}
{*</div>*}
